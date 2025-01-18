from django.db import models

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
