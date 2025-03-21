from django.urls import path
from . import views

app_name = 'subscriptions'

urlpatterns = [
    path('', views.plan_list, name='plan_list'),
    path('detail/', views.subscription_detail, name='detail'),
    path('create/<int:plan_id>/', views.subscription_create, name='create'),
    path('cancel/', views.subscription_cancel, name='cancel'),
    path('extend/', views.subscription_extend, name='extend'),
    path('protected/', views.protected_view, name='protected'),
] 