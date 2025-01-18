from django.contrib.auth.models import AbstractUser
from django.db import models

from locations.models import District, City, Country


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
    country = models.ForeignKey(Country, on_delete=models.SET_NULL,
                                null=True, blank=True, verbose_name='Страна')
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True,
                             blank=True, verbose_name="Город")
    district = models.ForeignKey(District, on_delete=models.SET_NULL,
                                 null=True,
                                 blank=True, verbose_name="Район")
    legal_address = models.TextField(blank=True, null=True,
                                     verbose_name='Юридический адрес')
    phone = models.CharField(max_length=20, blank=True, null=True,
                             verbose_name='Телефон')
    website = models.URLField(blank=True, null=True, verbose_name='Вебсайт')

    preferred_contact_method = models.CharField(
        'Предпочтительный канал связи',
        max_length=50,
        choices=[
            ("phone", "Телефон"),
            ("email", "Email"),
            ("messenger", "Мессенджер"),
        ],
        blank=True,
        null=True
    )
    contact_person = models.CharField(
        'Контактное лицо',
        max_length=200,
        blank=True, null=True
    )
    image = models.ImageField(
        'Изображение',
        upload_to='users/',
        blank=True, null=True
    )

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
