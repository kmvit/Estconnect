from django.contrib import admin
from modeltranslation.admin import TabbedTranslationAdmin
from .models import Country, District, City

@admin.register(Country)
class CountryAdmin(TabbedTranslationAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    group_fieldsets = True


@admin.register(District)
class RegionAdmin(TabbedTranslationAdmin):
    list_display = ('name', 'city')
    list_filter = ('city',)
    search_fields = ('name',)
    group_fieldsets = True


@admin.register(City)
class CityAdmin(TabbedTranslationAdmin):
    list_display = ('name', 'country')
    list_filter = ('country',)
    search_fields = ('name',)
    group_fieldsets = True
