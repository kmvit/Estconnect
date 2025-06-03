from modeltranslation.translator import register, TranslationOptions
from .models import Country, City, District


@register(Country)
class CountryTranslationOptions(TranslationOptions):
    fields = ('name',)


@register(City)
class CityTranslationOptions(TranslationOptions):
    fields = ('name',)


@register(District)
class DistrictTranslationOptions(TranslationOptions):
    fields = ('name',) 