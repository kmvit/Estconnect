from modeltranslation.translator import register, TranslationOptions
from .models import ConstructionObject, HousingClass, HousingType


@register(ConstructionObject)
class ConstructionObjectTranslationOptions(TranslationOptions):
    fields = ('name', 'description', 'address', 'amenities')


@register(HousingClass)
class HousingClassTranslationOptions(TranslationOptions):
    fields = ('name',)


@register(HousingType)
class HousingTypeTranslationOptions(TranslationOptions):
    fields = ('name',)

    


    
    
    

