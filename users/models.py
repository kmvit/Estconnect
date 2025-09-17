from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

from locations.models import District, City, Country


class CustomUser(AbstractUser):
    """
    Кастомный пользователь
    """
    ROLE_CHOICES = [
        ('developer', 'Застройщик'),
        ('agent', 'Агент'),
        ('admin', 'КАМ-менеджер'),
    ]

    LANGUAGE_CHOICES = [
        ('ru', 'Русский'),
        ('en', 'English'),
        ('th', 'ไทย'),
        ('zh-hans', '中文'),
    ]

    SUBSCRIPTION_CHOICES = [
        ('business', 'Business'),
        ('pro', 'Pro'),
        ('basic', 'Basic'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES,
                          default='agent', verbose_name='Роль пользователя')
    company_name = models.CharField('Название компании', max_length=255, blank=True, null=True)
    country = models.ForeignKey(Country, on_delete=models.SET_NULL,
                              null=True, blank=True, verbose_name='Страна')
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True,
                           blank=True, verbose_name="Город")
    district = models.ForeignKey(District, on_delete=models.SET_NULL,
                               null=True, blank=True, verbose_name="Район")
    legal_address = models.TextField(blank=True, null=True,
                                     verbose_name='Юридический адрес')
    phone = models.CharField(max_length=20, blank=True, null=True,
                           verbose_name='Телефон')
    email = models.EmailField(blank=True, null=True,
                              verbose_name='Адрес электронной почты')
    fio = models.CharField(max_length=255, blank=True, null=True,
                           verbose_name='ФИО')
    website = models.URLField(blank=True, null=True, verbose_name='Вебсайт')
    language = models.CharField('Язык', max_length=10, choices=LANGUAGE_CHOICES,
                              default='ru')
    profile_photo = models.ImageField(
        'Фото профиля',
        upload_to='users/profile_photos/',
        blank=True,
        null=True
    )
    subscription_type = models.CharField(
        'Тип подписки',
        max_length=20,
        choices=SUBSCRIPTION_CHOICES,
        default='basic'
    )
    subscription_end_date = models.DateField(
        'Дата окончания подписки',
        null=True,
        blank=True
    )
    preferred_contact_method = models.CharField(
        'Предпочтительный канал связи',
        max_length=50,
        choices=[
            ("email", "Электронная почта"),
            ("phone", "Телефон"),
        ],
        default="email"
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
    _favourite_objects = models.ManyToManyField(
        'developers.ConstructionObject',
        related_name='favourited_by_objects',
        blank=True,
        verbose_name='Избранные объекты',
        db_constraint=False  # Добавляем это
    )
    _favourite_developers = models.ManyToManyField(
        'self',  # Используем 'self' вместо 'users.CustomUser'
        related_name='favourited_by_users',
        blank=True,
        verbose_name='Избранные застройщики',
        limit_choices_to={'role': 'developer'},
        symmetrical=False  # Добавляем это
    )
    _favourite_agents = models.ManyToManyField(
        'self',
        related_name='favourited_by_agents',
        blank=True,
        verbose_name='Избранные агенты',
        limit_choices_to={'role': 'agent'},
        symmetrical=False
    )

    def __str__(self):
        return f"{self.get_full_name()} ({self.get_role_display()})"

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}" if self.first_name and self.last_name else self.username

    @property
    def favourite_objects(self):
        return self._favourite_objects.all()
    
    @property
    def favourite_developers(self):
        return self._favourite_developers.all()
    
    @property
    def favourite_agents(self):
        return self._favourite_agents.all()

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"


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
