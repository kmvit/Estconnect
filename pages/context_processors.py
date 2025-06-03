from django.apps import apps
from .models import Page, SiteSettings


def site_settings(request):
    try:
        if apps.is_installed('pages'):
            settings = SiteSettings.objects.first()
        else:
            settings = None
    except Exception:
        settings = None
    return {'site_settings': settings}


def menu_pages(request):
    return {
        'menu_pages': Page.objects.filter(show_in_menu=True).order_by('title')
    }
