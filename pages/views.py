from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.utils import translation
from django.conf import settings
from django.views.decorators.http import require_POST
from django.utils.translation import check_for_language
from django.urls import resolve


def index(request):
    """Главная страница"""
    return render(request, 'pages/index.html')


def about_us(request):
    """О продукте"""
    return render(request, 'pages/page-five.html')


def about_product(request):
    """Страница 'Почему EstConnect?'"""
    return render(request, 'pages/page-two.html')


def why_we(request):
    """Страница о преимуществах сотрудничества"""
    return render(request, 'pages/page-four.html')

def contacts(request):
    """Страница контактов"""
    return render(request, 'pages/contacts.html')


def sign_in(request):
    """Страница выбора типа входа"""
    return render(request, 'pages/sign-in.html')


def login_view(request):
    """Страница авторизации существующего пользователя"""
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        remember = request.POST.get('remember')
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            if not remember:
                request.session.set_expiry(0)  # Сессия истекает при закрытии браузера
            return redirect('pages:index')
        else:
            messages.error(request, 'Неверное имя пользователя или пароль')
    
    return render(request, 'pages/login.html')


def register(request):
    """Страница регистрации нового пользователя"""
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('pages:index')
    else:
        form = UserCreationForm()
    
    return render(request, 'pages/register.html', {'form': form})

