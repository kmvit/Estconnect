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


# Админка для пользователей (агенты и застройщики)
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
@admin.register(SupportTicket, site=cam_admin_site)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ('category', 'status', 'creator', 'manager', 'created_at')
    list_filter = ('status', 'category')
    search_fields = ('creator__username', 'manager__username')
    ordering = ['-created_at']

    def save_model(self, request, obj, form, change):
        """
        Если КАМ-менеджер отвечает на обращение, он автоматически назначается как менеджер.
        """
        if not obj.manager and request.user.role == 'admin':
            obj.manager = request.user
        super().save_model(request, obj, form, change)


# Сообщения в обращениях
@admin.register(SupportMessage, site=cam_admin_site)
class SupportMessageAdmin(admin.ModelAdmin):
    list_display = ('ticket', 'sender', 'created_at')
    search_fields = ('sender__username', 'ticket__id')
    ordering = ['created_at']


# Раздел застройщиков
@admin.register(ConstructionObject, site=cam_admin_site)
class ConstructionObjectAdmin(admin.ModelAdmin):
    list_display = ('address', 'city', 'property_type', 'comfort_type', 'area', 'project_status', 'is_published')
    list_filter = ('property_type', 'comfort_type', 'project_status', 'ownership_type', 'is_published')
    search_fields = ('address', 'city', 'district')
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