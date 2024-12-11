from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class SupportTicket(models.Model):
    STATUS_CHOICES = [
        ('open', 'Открыто'),
        ('closed', 'Закрыто'),
    ]

    creator = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='created_tickets',
        verbose_name='Создатель',
        default=1
    )
    manager = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name='managed_tickets',
        verbose_name='Менеджер',
        null=True,
        blank=True
    )
    title = models.CharField('Тема обращения', max_length=255)
    status = models.CharField(
        'Статус',
        max_length=10,
        choices=STATUS_CHOICES,
        default='open'
    )
    created_at = models.DateTimeField('Дата создания', auto_now_add=True)
    updated_at = models.DateTimeField('Дата обновления', auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.get_status_display()})"

    class Meta:
        verbose_name = 'Обращение'
        verbose_name_plural = 'Обращения'
        ordering = ['-created_at']


class SupportMessage(models.Model):
    ticket = models.ForeignKey(
        SupportTicket,
        on_delete=models.CASCADE,
        related_name='messages',
        verbose_name='Обращение'
    )
    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='sent_messages',
        verbose_name='Отправитель'
    )
    message = models.TextField('Сообщение')
    created_at = models.DateTimeField('Дата отправки', auto_now_add=True)

    def __str__(self):
        return f"Сообщение от {self.sender.username}"

    class Meta:
        verbose_name = 'Сообщение'
        verbose_name_plural = 'Сообщения'
        ordering = ['created_at']
