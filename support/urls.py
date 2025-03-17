from django.urls import path
from . import views

app_name = 'support'

urlpatterns = [
    path('', views.SupportViewSet.as_view(), name='support_list'),
    path('ticket/<int:ticket_id>/', views.SupportViewSet.as_view(), name='ticket_detail'),
]
