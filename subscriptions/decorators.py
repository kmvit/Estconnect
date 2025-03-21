from functools import wraps
from django.shortcuts import redirect
from django.contrib import messages
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from .models import Subscription

def subscription_required(view_func):
    """
    Декоратор для проверки наличия активной подписки.
    Если у пользователя нет активной подписки, он будет перенаправлен на страницу с планами подписки.
    """
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated:
            messages.warning(request, _('Для доступа к этой странице необходимо войти в систему'))
            return redirect('login')
        
        subscription = Subscription.objects.filter(
            user=request.user,
            is_active=True
        ).first()
        
        if not subscription or not subscription.is_valid():
            messages.warning(request, _('Для доступа к этой странице необходима активная подписка'))
            return redirect('subscriptions:plan_list')
        
        return view_func(request, *args, **kwargs)
    
    return _wrapped_view 