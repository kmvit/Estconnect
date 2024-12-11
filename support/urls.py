from django.urls import path
from .views import (
    create_ticket_view, ticket_list_view, ticket_detail_view, close_ticket_view
)

urlpatterns = [
    path('', ticket_list_view, name='ticket_list'),
    path('<int:ticket_id>/', ticket_detail_view, name='ticket_detail'),
    path('create/', create_ticket_view, name='create_ticket'),
    path('<int:ticket_id>/close/', close_ticket_view, name='close_ticket'),
]
