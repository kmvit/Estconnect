from django.contrib import admin
from .models import Page, Banner, TextBlock, SiteSettings


class BannerInline(admin.StackedInline):
    model = Banner
    extra = 0


class TextBlockInline(admin.StackedInline):
    model = TextBlock
    extra = 0


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = (
        'title', 'slug', 'is_homepage', 'show_in_menu', 'updated_at')
    list_editable = ('show_in_menu',)
    inlines = [BannerInline, TextBlockInline]  # Включаем оба блока
    prepopulated_fields = {'slug': ('title',)}
    list_filter = ('is_homepage', 'show_in_menu')


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ('phone', 'email', 'address')
    fieldsets = (
        (None, {
            'fields': ('logo', 'phone', 'email', 'address')
        }),
        ('Социальные сети', {
            'fields': ('instagram', 'vk', 'facebook', 'youtube'),
        }),
    )
