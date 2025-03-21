from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.views import View
from django.views.generic import ListView, DetailView, CreateView
from datetime import datetime

from .models import SupportTicket, SupportMessage
from .forms import SupportMessageForm


class SupportViewSet(LoginRequiredMixin, View):
    """
    ViewSet для работы с технической поддержкой.
    Объединяет функционал создания тикетов, просмотра списка и деталей,
    отправки сообщений и закрытия тикетов.
    """
    template_name = 'profile/dev_support.html'
    detail_template_name = 'support/ticket_detail.html'

    def get_context_data(self, **kwargs):
        user = self.request.user
        context = {
            'current_date': datetime.now(),
            'categories': SupportTicket.CATEGORY_CHOICES,
        }
        
        if 'ticket_id' in kwargs:
            # Контекст для детального просмотра тикета
            ticket = get_object_or_404(SupportTicket, id=kwargs['ticket_id'], creator=user)
            context.update({
                'ticket': ticket,
                'messages': ticket.messages.select_related('sender').order_by('created_at'),
                'form': SupportMessageForm(),
            })
        else:
            # Контекст для списка тикетов
            context.update({
                'tickets': SupportTicket.objects.filter(creator=user)
                    .prefetch_related('messages')
                    .order_by('-created_at'),
            })
        
        return context

    def get(self, request, *args, **kwargs):
        """Отображение списка тикетов или деталей конкретного тикета"""
        context = self.get_context_data(**kwargs)
        template = self.detail_template_name if 'ticket_id' in kwargs else self.template_name
        return render(request, template, context)

    def post(self, request, *args, **kwargs):
        """
        Обработка POST-запросов:
        - Создание нового тикета
        - Добавление сообщения к существующему тикету
        - Закрытие тикета
        """
        action = request.POST.get('action')
        
        if action == 'close_ticket' and 'ticket_id' in kwargs:
            return self.close_ticket(request, kwargs['ticket_id'])
        elif 'ticket_id' in kwargs:
            return self.add_message(request, kwargs['ticket_id'])
        else:
            return self.create_ticket(request)

    def create_ticket(self, request):
        """Создание нового тикета"""
        category = request.POST.get('category')
        message_text = request.POST.get('message')
        
        if not message_text:
            messages.error(request, 'Пожалуйста, введите сообщение')
            return render(request, self.template_name, self.get_context_data())
            
        if not category:
            category = 'site'
            
        ticket = SupportTicket.objects.create(
            creator=request.user,
            category=category,
            status='open'
        )
        
        SupportMessage.objects.create(
            ticket=ticket,
            sender=request.user,
            sender_type='creator',
            message=message_text
        )
            
        messages.success(request, 'Ваше обращение отправлено')
        return redirect('support:ticket_detail', ticket_id=ticket.id)

    def add_message(self, request, ticket_id):
        """Добавление сообщения к существующему тикету"""
        ticket = get_object_or_404(SupportTicket, id=ticket_id, creator=request.user)
        form = SupportMessageForm(request.POST)
        
        if form.is_valid():
            message = form.save(commit=False)
            message.ticket = ticket
            message.sender = request.user
            # Определяем тип отправителя
            if request.user == ticket.creator:
                message.sender_type = 'creator'
            elif request.user == ticket.manager:
                message.sender_type = 'manager'
            message.save()
            messages.success(request, 'Сообщение отправлено')
        else:
            messages.error(request, 'Пожалуйста, введите сообщение')
            
        return redirect('support:ticket_detail', ticket_id=ticket.id)

    def close_ticket(self, request, ticket_id):
        """Закрытие тикета"""
        ticket = get_object_or_404(SupportTicket, id=ticket_id, creator=request.user)
        ticket.status = 'closed'
        ticket.save()
        messages.success(request, 'Обращение закрыто')
        return redirect('support:ticket_detail', ticket_id=ticket.id)