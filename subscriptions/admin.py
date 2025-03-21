from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import SubscriptionPlan, SubscriptionFeature, Subscription

@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'duration_days', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'description')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        (None, {
            'fields': ('name', 'price', 'duration_days', 'description', 'is_active')
        }),
        (_('Дополнительная информация'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(SubscriptionFeature)
class SubscriptionFeatureAdmin(admin.ModelAdmin):
    list_display = ('name', 'plan', 'created_at')
    list_filter = ('plan', 'created_at')
    search_fields = ('name', 'description', 'plan__name')
    readonly_fields = ('created_at',)

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'plan', 'start_date', 'end_date', 'is_active', 'payment_status')
    list_filter = ('is_active', 'payment_status', 'plan', 'start_date', 'end_date')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'plan__name')
    readonly_fields = ('created_at', 'updated_at', 'start_date')
    
    fieldsets = (
        (_('Основная информация'), {
            'fields': ('user', 'plan', 'start_date', 'end_date', 'is_active')
        }),
        (_('Информация об оплате'), {
            'fields': ('payment_status', 'payment_id', 'auto_renewal')
        }),
        (_('Дополнительная информация'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'plan')
