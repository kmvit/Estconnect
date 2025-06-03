from django.apps import AppConfig
from modeltranslation.translator import translator, TranslationOptions


class DevelopersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'developers'


