from django.contrib import admin
from .models import (
    ConstructionObject, ConstructionObjectImage, HousingClass,
    HousingType, ContactMethod
)


@admin.register(ContactMethod)
class ContactMethodAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


# Инлайн для фотографий объектов
class ConstructionObjectImageInline(admin.TabularInline):
    model = ConstructionObjectImage
    extra = 1  # Показывать 1 пустую строку для добавления новой фотографии
    fields = ('image',)  # Поле, доступное для редактирования
    readonly_fields = ('image_preview',)  # Превью изображений

    def image_preview(self, obj):
        if obj.image:
            return f'<img src="{obj.image.url}" style="max-height: 100px;">'
        return "Нет изображения"

    image_preview.allow_tags = True
    image_preview.short_description = "Превью"


# Админка для объектов застройки
@admin.register(ConstructionObject)
class ConstructionObjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'property_type', 'comfort_type', 'area', 'project_status', 'is_published')
    list_filter = ('property_type', 'comfort_type', 'project_status', 'ownership_type', 'is_published')
    search_fields = ('name', 'city', 'district')
    inlines = [ConstructionObjectImageInline]
    date_hierarchy = 'created_at'
    list_per_page = 20


@admin.register(HousingClass)
class HousingClassAdmin(admin.ModelAdmin):
    search_fields = ('name',)


@admin.register(HousingType)
class HousingTypeAdmin(admin.ModelAdmin):
    search_fields = ('name',)


@admin.register(ConstructionObjectImage)
class ConstructionObjectImageAdmin(admin.ModelAdmin):
    list_display = ('construction_object', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('construction_object__address',)
