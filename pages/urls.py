from django.urls import path
from . import views

app_name = 'pages'

urlpatterns = [
    path('', views.index, name='index'),
    path('page-two/', views.page_two, name='page_two'),
    path('page-three/', views.page_three, name='page_three'),
    path('page-four/', views.page_four, name='page_four'),
    path('page-five/', views.page_five, name='page_five'),
    path('sign-in/', views.sign_in, name='sign-in')
]
