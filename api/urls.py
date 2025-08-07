from django.urls import path
from .views import HomePageAPIView

app_name = 'api'

urlpatterns = [
    path('home/', HomePageAPIView.as_view(), name='home'),
]
