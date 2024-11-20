from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user_model
from django.db import models  # Импорт для models.Q

User = get_user_model()

class CustomAuthBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            user = User.objects.filter(
                models.Q(username=username) |
                models.Q(phone=username) |
                models.Q(email=username)
            ).distinct().first()
            if user and user.check_password(password):
                return user
        except User.DoesNotExist:
            return None
        return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
