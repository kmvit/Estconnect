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
    email = models.EmailField(blank=True, null=True,
                              verbose_name='Адрес электронной почты')
    fio = models.CharField(max_length=255, blank=True, null=True,
                           verbose_name='ФИО')
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


class UserActivityLog(models.Model):
    """
    Лог действий пользователей в системе
    """
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE,
                             verbose_name="Клиент")
    action = models.CharField(max_length=255, verbose_name="Действие")
    created_at = models.DateTimeField(auto_now_add=True,
                                      verbose_name="Дата и время")

    def __str__(self):
        return f"{self.user.username} - {self.action} - {self.created_at.strftime('%d.%m.%Y %H:%M')}"

    class Meta:
        verbose_name = "Лог активности"
        verbose_name_plural = "Логи активности"
        ordering = ['-created_at']
