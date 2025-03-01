from django.urls import path
from . import views
from .views import profile_view, profile_edit_view, DeveloperListView, \
    DeveloperDetailView, AgentListView, AgentDetailView, admin_profile_view

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('profile/', profile_view, name='profile'),
    path('profile/<int:id>/', admin_profile_view, name='admin_profile_view'),  # Новый путь для администратора
    path('profile/edit/', profile_edit_view, name='profile_edit'),
    path('developers/', DeveloperListView.as_view(), name='developer_list'),
    path('developer/<int:pk>/', DeveloperDetailView.as_view(), name='developer_detail'),
    path('agents/', AgentListView.as_view(), name='agent_list'),
    path('detail/<int:pk>/', AgentDetailView.as_view(), name='agent_detail'),

]
