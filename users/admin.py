from django.contrib import admin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'company_name', 'phone')
    list_filter = ('role',)
    search_fields = ('username', 'email', 'company_name')
    fieldsets = (
        (None, {
            'fields': ('username', 'email', 'password', 'role', 'company_name',
                       'country', 'city', 'district', 'legal_address', 'phone',
                        'contact_person', 'preferred_contact_method',
                       'image',
                       'website')
        }),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'role'),
        }),
    )

    def save_model(self, request, obj, form, change):
        if obj.role == 'admin' and not change:
            obj.is_staff = True  # CAM-менеджеры автоматически становятся staff
        super().save_model(request, obj, form, change)
