from modeltranslation.translator import register, TranslationOptions
from .models import Page, TextBlock, Banner

@register(Page)
class PageTranslationOptions(TranslationOptions):
    fields = ('title', 'meta_description', 'meta_keywords')

@register(TextBlock)
class TextBlockTranslationOptions(TranslationOptions):
    fields = ('headline', 'content')

@register(Banner)
class BannerTranslationOptions(TranslationOptions):
    fields = ('headline', 'subheadline') 