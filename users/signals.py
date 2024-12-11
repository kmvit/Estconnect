from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from developers.models import Developer


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_developer_profile(sender, instance, created, **kwargs):
    """
    Создаёт объект Developer, если пользователь зарегистрирован с ролью 'developer'.
    """
    if created and instance.role == 'developer':
        Developer.objects.create(user=instance)
