from django.urls import path, include
from .views import HomePageAPIView
from rest_framework.routers import DefaultRouter
from api.apps.users.views import AuthViewSet, UserProfileViewSet, UserListViewSet, ObjectViewSet, SupportViewSet

app_name = 'api'

# Создаем роутеры для разных ViewSet'ов
auth_router = DefaultRouter()
auth_router.register(r'auth', AuthViewSet, basename='auth')

profile_router = DefaultRouter()
profile_router.register(r'profile', UserProfileViewSet, basename='profile')

users_router = DefaultRouter()
users_router.register(r'users', UserListViewSet, basename='users')

objects_router = DefaultRouter()
objects_router.register(r'objects', ObjectViewSet, basename='objects')

support_router = DefaultRouter()
support_router.register(r'support/tickets', SupportViewSet, basename='support')

urlpatterns = [
    path('home/', HomePageAPIView.as_view(), name='home'),
    
    # Auth endpoints
    path('', include(auth_router.urls)),
    
    # Profile endpoints
    path('', include(profile_router.urls)),
    
    # Users list endpoints
    path('', include(users_router.urls)),
    
    # Objects endpoints
    path('', include(objects_router.urls)),
    
    # Support endpoints
    path('', include(support_router.urls)),
]
