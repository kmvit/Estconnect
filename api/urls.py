from django.urls import path, include
from .views import HomePageAPIView
from rest_framework.routers import DefaultRouter
from api.apps.users.views import AuthViewSet, UserProfileViewSet, UserListViewSet

app_name = 'api'

# Создаем роутеры для разных ViewSet'ов
auth_router = DefaultRouter()
auth_router.register(r'auth', AuthViewSet, basename='auth')

profile_router = DefaultRouter()
profile_router.register(r'profile', UserProfileViewSet, basename='profile')

users_router = DefaultRouter()
users_router.register(r'users', UserListViewSet, basename='users')

urlpatterns = [
    path('home/', HomePageAPIView.as_view(), name='home'),
    
    # Auth endpoints
    path('', include(auth_router.urls)),
    
    # Profile endpoints
    path('', include(profile_router.urls)),
    
    # Users list endpoints
    path('', include(users_router.urls)),
]
