from django.db import models

from django.db import models


class Page(models.Model):
    title = models.CharField("Заголовок", max_length=200)
    slug = models.SlugField("Slug", unique=True)
    meta_description = models.TextField("Мета-описание для SEO", blank=True,
                                        null=True)
    meta_keywords = models.TextField("Мета-ключевые слова", blank=True,
                                     null=True)
    is_homepage = models.BooleanField("Это главная страница", default=False)
    show_in_menu = models.BooleanField("Показывать в меню", default=True)
    created_at = models.DateTimeField("Создано", auto_now_add=True)
    updated_at = models.DateTimeField("Обновлено", auto_now=True)

    class Meta:
        verbose_name = "Страница"
        verbose_name_plural = "Страницы"

    def save(self, *args, **kwargs):
        if self.is_homepage:
            Page.objects.filter(is_homepage=True).update(is_homepage=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Banner(models.Model):
    """
    Баннер
    """
    page = models.OneToOneField(Page, on_delete=models.CASCADE,
                                related_name='banner', verbose_name="Страница")
    image = models.ImageField("Изображение баннера", upload_to='banners/')
    headline = models.CharField("Заголовок баннера", max_length=200)
    subheadline = models.TextField("Подзаголовок баннера", blank=True,
                                   null=True)

    class Meta:
        verbose_name = "Баннер"
        verbose_name_plural = "Баннеры"

    def __str__(self):
        return f"Баннер для {self.page.title}"


class TextBlock(models.Model):
    page = models.OneToOneField(Page, on_delete=models.CASCADE,
                                related_name='text_block',
                                verbose_name="Страница")
    headline = models.CharField("Заголовок блока", max_length=200)
    content = models.TextField("Содержимое блока")

    class Meta:
        verbose_name = "Текстовый блок"
        verbose_name_plural = "Текстовые блоки"

    def __str__(self):
        return f"Текстовый блок для {self.page.title}"


class SiteSettings(models.Model):
    logo = models.ImageField("Логотип", upload_to="logos/", blank=True,
                             null=True)
    phone = models.CharField("Телефон", max_length=20, blank=True, null=True)
    email = models.EmailField("Email", blank=True, null=True)
    address = models.TextField("Адрес", blank=True, null=True)

    # Социальные сети
    instagram = models.URLField("Instagram", blank=True, null=True)
    vk = models.URLField("VK", blank=True, null=True)
    facebook = models.URLField("Facebook", blank=True, null=True)
    youtube = models.URLField("YouTube", blank=True, null=True)

    class Meta:
        verbose_name = "Настройки сайта"
        verbose_name_plural = "Настройки сайта"

    def __str__(self):
        return "Настройки сайта"

    def save(self, *args, **kwargs):
        if not self.pk and SiteSettings.objects.exists():
            raise ValueError(
                "Настройки сайта уже существуют. Измените существующую запись.")
        super().save(*args, **kwargs)
