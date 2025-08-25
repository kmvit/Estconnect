from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.core.validators import MinValueValidator
from django.utils import timezone

from locations.models import Country, City, District

User = get_user_model()


# Классы и типы жилья
class HousingClass(models.Model):
    name = models.CharField("Класс жилья", max_length=100, unique=True)

    class Meta:
        verbose_name = "Класс жилья"
        verbose_name_plural = "Классы жилья"

    def __str__(self):
        return self.name


class HousingType(models.Model):
    name = models.CharField("Тип жилья", max_length=100, unique=True)

    class Meta:
        verbose_name = "Тип жилья"
        verbose_name_plural = "Типы жилья"

    def __str__(self):
        return self.name


class ContactMethod(models.Model):
    name = models.CharField("Название канала связи", max_length=50,
                            unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Канал связи"
        verbose_name_plural = "Каналы связи"


# Объекты застройки
class ConstructionObject(models.Model):
    COMFORT_CHOICES = [
        ('economy', 'Эконом'),
        ('comfort', 'Комфорт'),
        ('business', 'Бизнес'),
        ('elite', 'Элитный'),
    ]

    PROPERTY_TYPE_CHOICES = [
        ('apartment', 'Квартира'),
        ('house', 'Дом'),
        ('commercial', 'Коммерческая недвижимость'),
        ('land', 'Земельный участок'),
    ]

    PROJECT_STATUS_CHOICES = [
        ('completed', 'Сдан'),
        ('in_progress', 'В процессе'),
        ('planned', 'Планируется'),
    ]

    OWNERSHIP_TYPE_CHOICES = [
        ('long_term_lease', 'Долгосрочная аренда'),
        ('ownership', 'Собственность'),
    ]
    name = models.CharField(max_length=255, verbose_name='Название объекта', null=True, blank=True)
    developer = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE, related_name='construction_objects')
    country = models.ForeignKey(Country, on_delete=models.CASCADE, verbose_name='Страна', null=True, blank=True)
    city = models.ForeignKey(City, on_delete=models.CASCADE, verbose_name='Город', null=True, blank=True)
    district = models.ForeignKey(District, on_delete=models.CASCADE, verbose_name='Район', null=True, blank=True)

    latitude = models.DecimalField('Широта', max_digits=10, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField('Долгота', max_digits=10, decimal_places=6, null=True, blank=True)
    
    property_type = models.CharField('Тип недвижимости', max_length=20, choices=PROPERTY_TYPE_CHOICES, null=True, blank=True)
    comfort_type = models.CharField('Комфорт', max_length=20, choices=COMFORT_CHOICES, null=True, blank=True)
    amenities = models.TextField(blank=True, null=True, verbose_name='Удобства', help_text='Перечислите удобства через запятую (например: бассейн, парковка, охрана)')
    
    ownership_type = models.CharField('Тип права', max_length=20, choices=OWNERSHIP_TYPE_CHOICES, null=True, blank=True)
    area = models.DecimalField('Площадь (м²)', max_digits=10, decimal_places=2, default=0, blank=True, validators=[MinValueValidator(0)])
    floors = models.IntegerField('Этажность', null=True, blank=True)
    project_status = models.CharField('Статус проекта', max_length=20, choices=PROJECT_STATUS_CHOICES, default='in_progress')
    
    description = models.TextField(verbose_name='Описание', blank=True, null=True)
    price_per_sqm = models.DecimalField('Цена за м²', max_digits=10, decimal_places=0, null=True, blank=True, validators=[MinValueValidator(0)])
    
    completion_date = models.DateField('Дата сдачи проекта', null=True, blank=True)
    address = models.TextField(verbose_name='Адрес', blank=True, null=True)
    documentations_link = models.URLField(verbose_name='Ссылка на документы', blank=True, null=True) 
    
    created_at = models.DateTimeField('Дата создания', default=timezone.now)
    updated_at = models.DateTimeField('Дата обновления', auto_now=True)
    is_published = models.BooleanField('Опубликовано', default=False)

    def __str__(self):
        return f"{self.name} ({self.city or 'Город не указан'})"

    class Meta:
        verbose_name = 'Объект недвижимости'
        verbose_name_plural = 'Объекты недвижимости'
        ordering = ['-created_at']


class ConstructionObjectImage(models.Model):
    construction_object = models.ForeignKey(
        ConstructionObject,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(upload_to='construction_objects/', max_length=255)
    created_at = models.DateTimeField('Дата создания', default=timezone.now)

    class Meta:
        verbose_name = 'Изображение объекта'
        verbose_name_plural = 'Изображения объекта'
        ordering = ['created_at']
