from modeltranslation.translator import register, TranslationOptions
from .models import SupportTicket, SupportMessage

@register(SupportTicket)
class SupportTicketTranslationOptions(TranslationOptions):
    fields = ('category',)

@register(SupportMessage)
class SupportMessageTranslationOptions(TranslationOptions):
    fields = ('message',) 