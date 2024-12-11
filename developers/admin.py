from django.contrib import admin
from .models import (
    Developer, ConstructionObject, ConstructionObjectImage,
    Country, City, District, HousingClass, HousingType
)


@admin.register(Developer)
class DeveloperAdmin(admin.ModelAdmin):
    list_display = (
    'name', 'company', 'phone', 'email', 'preferred_contact_method')
    search_fields = ('name', 'company', 'phone', 'email')


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
    list_display = (
    'name', 'developer', 'price_per_sqm', 'completion_date', 'city', 'country',
    'is_published')
    list_filter = (
    'housing_class', 'housing_type', 'parking', 'country', 'city',
    'is_published')
    search_fields = ('name', 'developer__name', 'location')
    inlines = [ConstructionObjectImageInline]  # Добавляем инлайн


@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    search_fields = ('name',)


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    search_fields = ('name',)
    list_filter = ('country',)


@admin.register(District)
class DistrictAdmin(admin.ModelAdmin):
    search_fields = ('name',)
    list_filter = ('city',)


@admin.register(HousingClass)
class HousingClassAdmin(admin.ModelAdmin):
    search_fields = ('name',)


@admin.register(HousingType)
class HousingTypeAdmin(admin.ModelAdmin):
    search_fields = ('name',)


@admin.register(ConstructionObjectImage)
class ConstructionObjectImageAdmin(admin.ModelAdmin):
    list_display = ('construction_object', 'image')