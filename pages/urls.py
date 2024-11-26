from django.urls import path
from .views import home_view, page_view

urlpatterns = [
    path('', home_view, name='home'),  # Главная страница
    path('<slug:slug>/', page_view, name='page_detail'),  # Другие страницы
]
