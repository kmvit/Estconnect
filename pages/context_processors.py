from .models import Page
from .models import SiteSettings


def site_settings(request):
    try:
        settings = SiteSettings.objects.first()
    except SiteSettings.DoesNotExist:
        settings = None
    return {'site_settings': settings}


def menu_pages(request):
    return {
        'menu_pages': Page.objects.filter(show_in_menu=True).order_by('title')
    }
