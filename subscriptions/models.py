from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class SubscriptionPlan(models.Model):
    name = models.CharField(_('Название'), max_length=100)
    price = models.DecimalField(_('Цена'), max_digits=10, decimal_places=2)
    duration_days = models.IntegerField(_('Длительность (дни)'), default=30)
    description = models.TextField(_('Описание'))
    is_active = models.BooleanField(_('Активен'), default=True)
    created_at = models.DateTimeField(_('Создан'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Обновлен'), auto_now=True)

    class Meta:
        verbose_name = _('План подписки')
        verbose_name_plural = _('Планы подписки')
        ordering = ['price']

    def __str__(self):
        return f"{self.name} - {self.price}₽"

class SubscriptionFeature(models.Model):
    plan = models.ForeignKey(
        SubscriptionPlan,
        on_delete=models.CASCADE,
        related_name='features',
        verbose_name=_('План подписки')
    )
    name = models.CharField(_('Название'), max_length=100)
    description = models.TextField(_('Описание'))
    created_at = models.DateTimeField(_('Создан'), auto_now_add=True)

    class Meta:
        verbose_name = _('Возможность подписки')
        verbose_name_plural = _('Возможности подписки')
        ordering = ['name']

    def __str__(self):
        return f"{self.plan.name} - {self.name}"

class Subscription(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('pending', _('Ожидает оплаты')),
        ('completed', _('Оплачено')),
        ('failed', _('Ошибка оплаты')),
        ('refunded', _('Возвращено')),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='subscriptions',
        verbose_name=_('Пользователь')
    )
    plan = models.ForeignKey(
        SubscriptionPlan,
        on_delete=models.CASCADE,
        related_name='subscriptions',
        verbose_name=_('План подписки')
    )
    start_date = models.DateTimeField(_('Дата начала'), auto_now_add=True)
    end_date = models.DateTimeField(_('Дата окончания'))
    is_active = models.BooleanField(_('Активна'), default=True)
    payment_status = models.CharField(
        _('Статус оплаты'),
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default='pending'
    )
    payment_id = models.CharField(
        _('ID платежа'),
        max_length=100,
        blank=True,
        null=True
    )
    auto_renewal = models.BooleanField(
        _('Автоматическое продление'),
        default=True
    )
    created_at = models.DateTimeField(_('Создана'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Обновлена'), auto_now=True)

    class Meta:
        verbose_name = _('Подписка')
        verbose_name_plural = _('Подписки')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.plan.name}"

    def is_valid(self):
        """Проверяет, действительна ли подписка"""
        from django.utils import timezone
        return self.is_active and self.end_date > timezone.now()

    def extend(self, days=None):
        """Продлевает подписку на указанное количество дней или на стандартный период"""
        from django.utils import timezone
        if days is None:
            days = self.plan.duration_days
        self.end_date = self.end_date + timezone.timedelta(days=days)
        self.save()

class FinancialOperation(models.Model):
    OPERATION_TYPES = [
        ('deposit', _('Пополнение')),
        ('withdrawal', _('Вывод')),
        ('subscription', _('Подписка')),
        ('refund', _('Возврат')),
    ]

    STATUS_CHOICES = [
        ('pending', _('В обработке')),
        ('completed', _('Успешно')),
        ('failed', _('Ошибка')),
        ('cancelled', _('Отменено')),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='financial_operations',
        verbose_name=_('Пользователь')
    )
    operation_type = models.CharField(
        _('Тип операции'),
        max_length=20,
        choices=OPERATION_TYPES
    )
    amount = models.DecimalField(
        _('Сумма'),
        max_digits=10,
        decimal_places=2
    )
    description = models.TextField(_('Описание'))
    status = models.CharField(
        _('Статус'),
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    created_at = models.DateTimeField(_('Создано'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Обновлено'), auto_now=True)

    class Meta:
        verbose_name = _('Финансовая операция')
        verbose_name_plural = _('Финансовые операции')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.get_operation_type_display()} - {self.amount}₽"
