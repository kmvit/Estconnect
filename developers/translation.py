from modeltranslation.translator import register, TranslationOptions
from .models import ConstructionObject


@register(ConstructionObject)
class ConstructionObjectTranslation(TranslationOptions):
    fields = ('name', 'description', 'address', 'amenities') 

    


    
    
    

