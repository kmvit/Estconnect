from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.utils import timezone
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.utils.translation import gettext_lazy as _

from .models import SubscriptionPlan, Subscription, SubscriptionFeature
from .decorators import subscription_required

def plan_list(request):
    """Список доступных планов подписки"""
    plans = SubscriptionPlan.objects.filter(is_active=True).prefetch_related('features')
    return render(request, 'subscriptions/plan_list.html', {
        'plans': plans
    })

@login_required
def subscription_detail(request):
    """Детальная информация о текущей подписке пользователя"""
    subscription = Subscription.objects.filter(
        user=request.user,
        is_active=True
    ).select_related('plan').first()
    
    return render(request, 'subscriptions/subscription_detail.html', {
        'subscription': subscription
    })

@login_required
def subscription_create(request, plan_id):
    """Создание новой подписки"""
    plan = get_object_or_404(SubscriptionPlan, id=plan_id, is_active=True)
    
    # Проверяем, нет ли уже активной подписки
    if Subscription.objects.filter(user=request.user, is_active=True).exists():
        messages.warning(request, _('У вас уже есть активная подписка'))
        return redirect('subscriptions:detail')
    
    # Создаем подписку
    subscription = Subscription.objects.create(
        user=request.user,
        plan=plan,
        end_date=timezone.now() + timezone.timedelta(days=plan.duration_days)
    )
    
    # TODO: Здесь будет логика оплаты
    messages.success(request, _('Подписка успешно создана'))
    return redirect('subscriptions:detail')

@login_required
@require_POST
def subscription_cancel(request):
    """Отмена подписки"""
    subscription = get_object_or_404(
        Subscription,
        user=request.user,
        is_active=True
    )
    
    subscription.is_active = False
    subscription.auto_renewal = False
    subscription.save()
    
    messages.success(request, _('Подписка успешно отменена'))
    return redirect('subscriptions:detail')

@login_required
@require_POST
def subscription_extend(request):
    """Продление подписки"""
    subscription = get_object_or_404(
        Subscription,
        user=request.user,
        is_active=True
    )
    
    subscription.extend()
    
    messages.success(request, _('Подписка успешно продлена'))
    return redirect('subscriptions:detail')

@subscription_required
def protected_view(request):
    """Пример защищенного представления, требующего активной подписки"""
    return render(request, 'subscriptions/protected_view.html')
