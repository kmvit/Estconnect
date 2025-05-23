from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    
    # Профиль пользователя
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('profile/<int:id>/', views.admin_profile_view, name='admin_profile_view'),
    path('profile/finance/', views.ProfileFinanceView.as_view(), name='profile_finance'),
    
    # Объекты в профиле застройщика
    path('profile/objects/', views.ProfileObjectsView.as_view(), name='object_list'),
    path('profile/objects/add/', views.ProfileObjectsView.as_view(), name='object_add'),
    path('profile/objects/<int:pk>/', views.ProfileObjectsView.as_view(), name='object_detail'),
    path('profile/objects/<int:pk>/edit/', views.ProfileObjectsView.as_view(), name='object_edit'),
    path('profile/objects/<int:pk>/delete/', views.ProfileObjectsView.as_view(), name='object_delete'),
    path('profile/objects/<int:pk>/toggle-favourite/', views.toggle_favourite, name='toggle_favourite'),
    path('profile/favourites/', views.ProfileObjectsView.as_view(), name='favourites'),
    path('profile/objects/registration/', views.ObjectRegistrationView.as_view(), name='object_registration'),
    
    # Застройщики
    path('profile/developers/', views.DeveloperCatalogView.as_view(), name='developer_list'),
    path('profile/developers/<int:pk>/', views.DeveloperDetailView.as_view(), name='developer_detail'),
    path('profile/developers/<int:pk>/toggle-favourite/', views.toggle_favourite_developer, name='toggle_favourite_developer'),
    
    # Агенты
    path('profile/agents/', views.AgentListView.as_view(), name='agent_list'),
    path('profile/agents/<int:pk>/', views.AgentDetailView.as_view(), name='agent_detail'),
]
