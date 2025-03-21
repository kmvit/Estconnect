from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.urls import reverse
from django.utils.html import format_html

from developers.admin import ConstructionObjectImageInline
from users.models import CustomUser, UserActivityLog
from developers.models import ConstructionObject, ConstructionObjectImage
from support.models import SupportTicket, SupportMessage



class СamAdminSite(admin.AdminSite):
    """
    Админ-панель для КАМ-менеджера
    """
    site_header = "КАМ-Менеджер"
    site_title = "КАМ-Админ"
    index_title = "Панель управления КАМ-менеджера"

    def has_permission(self, request):
        return request.user.is_authenticated and request.user.role == 'admin'


cam_admin_site = СamAdminSite(name='cam_admin')


@admin.register(CustomUser, site=cam_admin_site)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        'username',
        'email',
        'role',
        'company_name',
        'phone',
        'goto_profile'
    )
    list_filter = ('role',)
    search_fields = ('username', 'email', 'company_name')
    fieldsets = (
        (None, {
            'fields': ('username', 'email', 'password', 'role', 'company_name',
                       'country', 'city', 'district', 'legal_address', 'phone',
                       'contact_person', 'preferred_contact_method',
                       'image',
                       'website', '_favourite_objects', '_favourite_developers')
        }),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'role'),
        }),
    )

    def goto_profile(self, obj):
        url = reverse('users:admin_profile_view',
                      args=[obj.id])  # Используем новый маршрут
        return format_html(
            '<a href="{}" target="_blank" class="button">Перейти в ЛК</a>',
            url)

    goto_profile.short_description = "Перейти в ЛК"  # Название столбца

    def save_model(self, request, obj, form, change):
        if obj.role == 'admin' and not change:
            obj.is_staff = True  # CAM-менеджеры автоматически становятся staff
        super().save_model(request, obj, form, change)


# Обращения (КАМ-менеджер может назначать себя)
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

@admin.register(SupportTicket, site=cam_admin_site)
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



# Раздел застройщиков
@admin.register(ConstructionObject, site=cam_admin_site)
class ConstructionObjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'developer', 'city', 'property_type', 'comfort_type', 'area', 'project_status', 'is_published')
    list_filter = ('property_type', 'comfort_type', 'project_status', 'ownership_type', 'is_published')
    search_fields = ('name', 'city', 'district')
    inlines = [ConstructionObjectImageInline]
    date_hierarchy = 'created_at'
    list_per_page = 20


@admin.register(UserActivityLog, site=cam_admin_site)
class UserActivityLogAdmin(admin.ModelAdmin):
    list_display = ("user", "action", "created_at")  # Поля в списке
    list_filter = ("user", "created_at")  # Фильтрация по пользователям и дате
    search_fields = (
        "user__username", "action")  # Поиск по имени пользователя и действию
    ordering = ("-created_at",)  # Сортировка по дате


class ConstructionObjectImageInline(admin.TabularInline):
    model = ConstructionObjectImage
    extra = 1

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    pass