from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from .models import SupportTicket, SupportMessage
from .forms import SupportTicketForm, SupportMessageForm

@login_required
def ticket_list_view(request):
    """Список обращений пользователя"""
    tickets = SupportTicket.objects.filter(creator=request.user)
    return render(request, 'support/ticket_list.html', {'tickets': tickets})


@login_required
def ticket_detail_view(request, ticket_id):
    """Детали обращения и переписка"""
    ticket = get_object_or_404(SupportTicket, id=ticket_id, creator=request.user)
    messages = ticket.messages.all()

    if request.method == 'POST':
        form = SupportMessageForm(request.POST)
        if form.is_valid():
            message = form.save(commit=False)
            message.ticket = ticket
            message.sender = request.user
            message.save()
            return redirect('ticket_detail', ticket_id=ticket.id)
    else:
        form = SupportMessageForm()

    return render(request, 'support/ticket_detail.html', {'ticket': ticket, 'messages': messages, 'form': form})


@login_required
def create_ticket_view(request):
    """Создание нового обращения"""
    if request.method == 'POST':
        form = SupportTicketForm(request.POST)
        if form.is_valid():
            # Создаём обращение
            ticket = form.save(commit=False)
            ticket.creator = request.user
            ticket.save()

            # Создаём первое сообщение
            SupportMessage.objects.create(
                ticket=ticket,
                sender=request.user,
                message=form.cleaned_data['message']
            )

            return redirect('ticket_list')  # Перенаправляем на список обращений
    else:
        form = SupportTicketForm()

    return render(request, 'support/ticket_create.html', {'form': form})


@login_required
def close_ticket_view(request, ticket_id):
    """Закрытие обращения"""
    ticket = get_object_or_404(SupportTicket, id=ticket_id, creator=request.user)
    if request.method == 'POST':
        ticket.status = 'closed'
        ticket.save()
        return redirect('ticket_detail', ticket_id=ticket.id)
    return redirect('ticket_detail', ticket_id=ticket.id)