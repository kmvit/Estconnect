from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin

from django.views.generic import ListView, DetailView
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, authenticate, get_user_model

from developers.models import ConstructionObject
from .forms import CustomUserCreationForm, CustomLoginForm, UserProfileForm
from .models import CustomUser, UserActivityLog

User = get_user_model()


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


@login_required
def admin_profile_view(request, id):
    """
    Просмотр профиля другого пользователя (только для админов и КАМ-менеджеров)
    """
    if request.user.role != 'admin':  # Ограничиваем доступ
        return redirect('profile')

    user = get_object_or_404(User, id=id)
    return render(request, 'users/profile.html', {'user': user})


@login_required
def profile_view(request):
    """
    Универсальное представление профиля:
    - Если user.role == developer -> профиль застройщика
    - Если user.role == agent -> профиль агента
    - И т.д.
    """
    user = request.user
    return render(request, 'users/profile.html', {'user': user})


@login_required
def profile_edit_view(request):
    """
    Редактирование своего профиля (без изменения role).
    """
    user = request.user
    if request.method == 'POST':
        form = UserProfileForm(request.POST, request.FILES, instance=user)
        if form.is_valid():
            UserActivityLog.objects.create(user=user,
                                           action="Обновил описание в профиле")
            form.save()
            return redirect('profile')
    else:
        form = UserProfileForm(instance=user)

    return render(request, 'users/profile_edit.html', {'form': form})


class AgentRequiredMixin(UserPassesTestMixin):
    def test_func(self):
        return self.request.user.is_authenticated and self.request.user.role == 'agent'

    def handle_no_permission(self):
        from django.core.exceptions import PermissionDenied
        raise PermissionDenied


class DeveloperListView(LoginRequiredMixin, AgentRequiredMixin, ListView):
    """
    Список застройщиков для агента
    c сортировкой по алфавиту (company_name), региону (region__name),
    типу недвижимости (real_estate_type).
    """
    model = CustomUser
    template_name = 'users/developer_list.html'
    context_object_name = 'developers'
    paginate_by = 10  # если нужна пагинация, иначе уберите

    def get_queryset(self):
        qs = CustomUser.objects.filter(role='developer')

        sort_by = self.request.GET.get('sort_by')
        if sort_by == 'alphabet':
            # Сортировка по названию компании
            qs = qs.order_by('company_name')
        elif sort_by == 'district':
            # Сортировка по региону (если region — ForeignKey)
            qs = qs.order_by('district__name')
        elif sort_by == 'type':
            # Сортировка по типу недвижимости
            qs = qs.order_by('real_estate_type')
        else:
            # По умолчанию - сортируем по дате создания/имени/чему угодно
            qs = qs.order_by('company_name')

        return qs


class DeveloperDetailView(DetailView):
    model = User
    template_name = 'users/developer_detail.html'  # Ваш шаблон
    context_object_name = 'developer'

    def get_queryset(self):
        # Фильтруем только тех пользователей, у кого role='developer'
        return User.objects.filter(role='developer')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Текущий застройщик
        developer = self.object  # тот пользователь, которого мы смотрим
        # Получаем список объектов застройки
        objects_qs = ConstructionObject.objects.filter(developer=developer)
        context['construction_objects'] = objects_qs
        return context


class AgentListView(LoginRequiredMixin, ListView):
    """
    Список всех агентов:
    - Выводит пользователей с role='agent'
    - Можно добавить сортировку, если нужно
    """
    model = CustomUser
    template_name = 'users/agent_list.html'
    context_object_name = 'agents'
    paginate_by = 10  # Опционально, если нужна пагинация

    def get_queryset(self):
        # Базовый запрос: только пользователи, у которых role='agent'
        qs = CustomUser.objects.filter(role='agent')

        # Если нужна сортировка, проверяем GET-параметр sort_by
        sort_by = self.request.GET.get('sort_by')
        if sort_by == 'alphabet':
            qs = qs.order_by('company_name')
        elif sort_by == 'district':
            qs = qs.order_by('district__name')  # если region — ForeignKey
        elif sort_by == 'city':
            qs = qs.order_by('city__name')  # если city — ForeignKey
        else:
            # По умолчанию сортируем по имени пользователя или как нужно
            qs = qs.order_by('username')

        return qs


class AgentDetailView(LoginRequiredMixin, DetailView):
    model = CustomUser
    template_name = 'users/agent_detail.html'
    context_object_name = 'agent'

    def get_queryset(self):
        return CustomUser.objects.filter(role='agent')
