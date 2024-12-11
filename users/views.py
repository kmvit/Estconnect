from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from .forms import CustomUserCreationForm, CustomLoginForm


def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)  # Автоматический вход после регистрации
            return redirect('home')  # Укажите URL домашней страницы
    else:
        form = CustomUserCreationForm()
    return render(request, 'register.html', {'form': form})


def login_view(request):
    form = CustomLoginForm()
    error_message = None

    if request.method == 'POST':
        form = CustomLoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user:
                login(request, user)
                return redirect(
                    'home')  # Замените на ваш URL после авторизации
            else:
                error_message = "Неверный логин, телефон, email или пароль."

    return render(request, 'login.html',
                  {'form': form, 'error_message': error_message})


def logout_view(request):
    logout(request)
    return redirect('login')  # Замените на нужный URL
