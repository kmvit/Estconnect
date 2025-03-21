from django.urls import path
from . import views

app_name = 'pages'

urlpatterns = [
    path('', views.index, name='index'),
    path('about-us/', views.about_us, name='about-us'),
    path('about-product/', views.about_product, name='about-product'),
    path('why-we/', views.why_we, name='why-we'),
    path('contacts/', views.contacts, name='contacts'),
    path('sign-in/', views.sign_in, name='sign-in')
]
