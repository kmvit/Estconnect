from django.contrib.auth.models import AbstractUser
from django.db import models


class Country(models.Model):
    """
    Страна пользователя
    """
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name = "Страна"
        verbose_name_plural = "Страны"
        ordering = ['name']

    def __str__(self):
        return self.name


class CustomUser(AbstractUser):
    """
    Кастомный пользователь
    """
    ROLE_CHOICES = [
        ('developer', 'Застройщик'),
        ('agent', 'Агент'),
        ('admin', 'CAM-менеджер'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES,
                            default='agent', verbose_name='Роль пользователя')
    company_name = models.CharField(max_length=255, blank=True, null=True)
    country = models.ForeignKey('Country', on_delete=models.SET_NULL,
                                null=True, blank=True, verbose_name='Страна')
    legal_address = models.TextField(blank=True, null=True,
                                     verbose_name='Юридический адрес')
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name='Телефон')
    website = models.URLField(blank=True, null=True, verbose_name='Вебсайт')

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
