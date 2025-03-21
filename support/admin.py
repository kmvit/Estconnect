from django.contrib import admin
from .models import SupportTicket, SupportMessage
from users.models import CustomUser

class SupportMessageInline(admin.TabularInline):
    model = SupportMessage
    extra = 0
    readonly_fields = ('sender_type', 'sender')
    fields = ('sender', 'sender_type', 'message')

    def save_model(self, request, obj, form, change):
        if not change:  # Если это создание нового сообщения
            # Получаем текущий тикет
            ticket_id = request.resolver_match.kwargs.get('object_id')
            if ticket_id:
                ticket = SupportTicket.objects.get(id=ticket_id)
                # Устанавливаем отправителя как менеджера тикета
                if ticket.manager:
                    obj.sender = ticket.manager
                    obj.sender_type = 'manager'
                else:
                    # Если менеджер не назначен, используем текущего пользователя
                    obj.sender = request.user
                    obj.sender_type = 'creator'
        super().save_model(request, obj, form, change)

@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ('category', 'creator', 'manager', 'status', 'created_at', 'updated_at')
    list_filter = ('status',)
    search_fields = ('category', 'creator__username', 'manager__username')
    inlines = [SupportMessageInline]
    readonly_fields = ('creator',)

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "manager":
            kwargs["queryset"] = CustomUser.objects.filter(role='admin')
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def save_model(self, request, obj, form, change):
        if not change:  # Если это создание нового объекта
            obj.creator = request.user
        super().save_model(request, obj, form, change)

    def save_formset(self, request, form, formset, change):
        instances = formset.save(commit=False)
        for instance in instances:
            if isinstance(instance, SupportMessage):
                instance.sender = form.instance.manager
                instance.sender_type = 'manager'
        formset.save()
