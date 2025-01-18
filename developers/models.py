from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.contrib.auth import get_user_model
from django.db.models import Q

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
    name = models.CharField("Название", max_length=200)
    price_per_sqm = models.DecimalField("Цена за квадрат", max_digits=10,
                                        decimal_places=2)
    housing_class = models.ForeignKey(HousingClass, on_delete=models.CASCADE,
                                      verbose_name="Класс жилья")
    housing_type = models.ForeignKey(HousingType, on_delete=models.CASCADE,
                                     verbose_name="Тип жилья")
    completion_date = models.DateField("Срок сдачи")
    parking = models.CharField(
        "Парковка",
        max_length=50,
        choices=[
            ("underground", "Подземная"),
            ("ground", "Наземная"),
            ("none", "Нет"),
        ],
    )
    buildings = models.PositiveIntegerField("Количество корпусов")
    floors = models.PositiveIntegerField("Этажность")
    address = models.CharField("Адрес", max_length=255, blank=True,
                               null=True)  # Поле для адреса
    latitude = models.FloatField("Широта", blank=True, null=True)  # Координаты
    longitude = models.FloatField("Долгота", blank=True, null=True)

    description = models.TextField("Описание", blank=True, null=True)
    developer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='construction_objects',
        limit_choices_to={'role': 'developer'},
        # Показывать в админке только пользователей с role='developer'
        verbose_name='Застройщик'
    )
    is_published = models.BooleanField("Опубликован",
                                       default=False)

    class Meta:
        verbose_name = "Объект застройки"
        verbose_name_plural = "Объекты застройки"


    def __str__(self):
        return self.name



class ConstructionObjectImage(models.Model):
    image = models.ImageField("Изображение", upload_to="construction_objects/")
    construction_object = models.ForeignKey(ConstructionObject,
                                            on_delete=models.CASCADE,
                                            related_name="images")

    class Meta:
        verbose_name = "Фотография объекта"
        verbose_name_plural = "Фотографии объектов"

    def __str__(self):
        return f"Фото для {self.construction_object.name}"
