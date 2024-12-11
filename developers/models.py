from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


# Страны, города и районы
class Country(models.Model):
    name = models.CharField("Страна", max_length=100, unique=True)

    class Meta:
        verbose_name = "Страна"
        verbose_name_plural = "Страны"

    def __str__(self):
        return self.name


class City(models.Model):
    name = models.CharField("Город", max_length=100)
    country = models.ForeignKey(Country, on_delete=models.CASCADE,
                                related_name="cities")

    class Meta:
        verbose_name = "Город"
        verbose_name_plural = "Города"
        unique_together = ('name', 'country')

    def __str__(self):
        return f"{self.name}, {self.country.name}"


class District(models.Model):
    name = models.CharField("Район", max_length=100)
    city = models.ForeignKey(City, on_delete=models.CASCADE,
                             related_name="districts")

    class Meta:
        verbose_name = "Район"
        verbose_name_plural = "Районы"
        unique_together = ('name', 'city')

    def __str__(self):
        return f"{self.name}, {self.city.name}"


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


# Застройщики
class Developer(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='developer_profile',  # Это важно для обратного доступа
        verbose_name="Пользователь"
    )
    name = models.CharField("Название", max_length=200)
    company = models.CharField("Компания", max_length=200)
    image = models.ImageField("Изображение", upload_to="developers/",
                              blank=True, null=True)
    phone = models.CharField("Номер телефона", max_length=20)
    email = models.EmailField("Почта")
    contact_person = models.CharField("Контактное лицо", max_length=200)
    preferred_contact_method = models.CharField(
        "Предпочтительный канал связи",
        max_length=50,
        choices=[
            ("phone", "Телефон"),
            ("email", "Email"),
            ("messenger", "Мессенджер"),
        ],
    )

    class Meta:
        verbose_name = "Застройщик"
        verbose_name_plural = "Застройщики"

    def __str__(self):
        return self.name


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
    country = models.ForeignKey(Country, on_delete=models.CASCADE,
                                verbose_name="Страна")
    city = models.ForeignKey(City, on_delete=models.CASCADE,
                             verbose_name="Город")
    district = models.ForeignKey(District, on_delete=models.CASCADE,
                                 verbose_name="Район")
    description = models.TextField("Описание", blank=True, null=True)
    developer = models.ForeignKey(Developer, on_delete=models.CASCADE,
                                  related_name="construction_objects")
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