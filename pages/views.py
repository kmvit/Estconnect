from django.shortcuts import render, get_object_or_404
from .models import Page


def home_view(request):
    # Получаем страницу, помеченную как главная
    homepage = get_object_or_404(Page, is_homepage=True)
    return render(request, ' pages/home.html', {'page': homepage})


def page_view(request, slug):
    # Получаем страницу по slug
    page = get_object_or_404(Page, slug=slug)
    return render(request, ' pages/page.html', {'page': page})
