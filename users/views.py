from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.views.generic import ListView, DetailView
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, authenticate, get_user_model
from django.urls import reverse_lazy
from django.contrib import messages
from django.views import View
from django.db.models import Q
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.utils.decorators import method_decorator
from django.utils import timezone
from developers.forms import ConstructionObjectForm
from developers.models import ConstructionObject, ConstructionObjectImage
from developers.views import ConstructionObjectViewSet
import locations
from .forms import CustomUserCreationForm, CustomLoginForm, UserProfileForm, EstateSearchForm, InvoiceForm
from .models import CustomUser, UserActivityLog
from locations.models import Country, City, District
from subscriptions.models import Subscription, SubscriptionPlan, FinancialOperation

User = get_user_model()


class ProfileView(LoginRequiredMixin, View):
    """
    Универсальное представление профиля:
    - GET: отображение профиля
    - POST: обновление данных профиля
    """
    template_name = 'profile/profile.html'

    def get_context_data(self, **kwargs):
        user = self.request.user
        return {
            'user': user,
            'form': UserProfileForm(instance=user),
            'activities': UserActivityLog.objects.filter(user=user).order_by('-created_at')[:5]
        }

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name, self.get_context_data())

    def post(self, request, *args, **kwargs):
        user = request.user
        form = UserProfileForm(request.POST, request.FILES, instance=user)

        if form.is_valid():
            try:
                user = form.save()
                if 'profile_photo' in request.FILES:
                    UserActivityLog.objects.create(
                        user=user,
                        action="Обновил фото профиля"
                    )
                messages.success(request, "Фото профиля успешно обновлено")

                if 'image' in request.FILES:
                    UserActivityLog.objects.create(
                        user=user,
                        action="Обновил баннер профиля"
                    )
                    messages.success(
                        request, "Баннер профиля успешно обновлен")

                if not ('profile_photo' in request.FILES or 'image' in request.FILES):
                    UserActivityLog.objects.create(
                        user=user,
                        action="Обновил информацию профиля"
                    )
                    messages.success(request, "Профиль успешно обновлен")

                return redirect('users:profile')
            except Exception as e:
                messages.error(request, f"Ошибка при сохранении: {str(e)}")
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"Ошибка в поле {field}: {error}")

        context = self.get_context_data()
        context['form'] = form
        return render(request, self.template_name, context)


def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.role = request.POST.get('role', 'developer')
            user.save()

            UserActivityLog.objects.create(
                user=user,
                action="Зарегистрировался как {}".format(
                    "застройщик" if user.role == 'developer' else "агент"
                )
            )

            login(request, user)
            return redirect('pages:index')
    else:
        form = CustomUserCreationForm()

    return render(request, 'users/register.html', {'form': form})


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
                return redirect('pages:index')
            else:
                error_message = "Неверный логин, телефон, email или пароль."

    return render(request, 'users/login.html',
                  {'form': form, 'error_message': error_message})


def logout_view(request):
    logout(request)
    return redirect('pages:index')


@login_required
def admin_profile_view(request, id):
    """
    Просмотр профиля другого пользователя (только для админов и КАМ-менеджеров)
    """
    if request.user.role != 'admin':
        return redirect('users:profile')

    user = get_object_or_404(User, id=id)
    return render(request, 'profile/profile.html', {'user': user})


class AgentListView(LoginRequiredMixin, ListView):
    """
    Список всех агентов:
    - Выводит пользователей с role='agent'
    - Можно добавить сортировку, если нужно
    """
    model = CustomUser
    template_name = 'profile/agent_catalog.html'
    context_object_name = 'agents'
    paginate_by = 12

    def get_queryset(self):
        queryset = CustomUser.objects.filter(role='agent')

        # Получаем параметры поиска
        country = self.request.GET.get('country')
        search = self.request.GET.get('search')

        # Применяем фильтры поиска
        if country:
            queryset = queryset.filter(country__name__icontains=country)

        if search:
            queryset = queryset.filter(company_name__icontains=search)

        # Получаем параметр сортировки из URL
        sort = self.request.GET.get('sort')

        # Применяем сортировку в зависимости от параметра
        if sort == 'name_asc':
            queryset = queryset.order_by('company_name')
        elif sort == 'name_desc':
            queryset = queryset.order_by('-company_name')
        elif sort == 'date_asc':
            queryset = queryset.order_by('date_joined')
        elif sort == 'date_desc':
            queryset = queryset.order_by('-date_joined')
        else:
            # Сортировка по умолчанию
            queryset = queryset.order_by('-date_joined')

        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sort'] = self.request.GET.get('sort')
        # Добавляем параметры поиска в контекст для сохранения значений в форме
        context['search_params'] = {
            'country': self.request.GET.get('country', ''),
            'search': self.request.GET.get('search', '')
        }
        return context


class AgentDetailView(LoginRequiredMixin, DetailView):
    model = CustomUser
    template_name = 'profile/agent_detail.html'
    context_object_name = 'agent'


class ProfileObjectsView(LoginRequiredMixin, View):
    """
    Представление для просмотра всех объектов
    """
    template_name_list = 'profile/object_list.html'
    template_name_form = 'profile/object-plus.html'
    template_name_detail = 'profile/object_detail.html'
    template_name_favourites = 'profile/favourites.html'
    form_class = ConstructionObjectForm
    success_url = reverse_lazy('users:object_list')

    def get_queryset(self):
        queryset = ConstructionObject.objects.filter(is_published=True)

        # Получаем параметры поиска из GET-запроса
        search = self.request.GET.get('search')
        country = self.request.GET.get('country')
        name = self.request.GET.get('name')
        developer = self.request.GET.get('developer')
        price_from = self.request.GET.get('price_from')
        price_to = self.request.GET.get('price_to')
        object_type = self.request.GET.get('object_type')
        beach_distance_from = self.request.GET.get('beach_distance_from')
        beach_distance_to = self.request.GET.get('beach_distance_to')

        # Применяем фильтры
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search) |
                Q(address__icontains=search)
            )
        if country:
            queryset = queryset.filter(country__name__icontains=country)
        if name:
            queryset = queryset.filter(name__icontains=name)
        if developer:
            queryset = queryset.filter(
                developer__company_name__icontains=developer)
        if price_from:
            queryset = queryset.filter(price_per_sqm__gte=price_from)
        if price_to:
            queryset = queryset.filter(price_per_sqm__lte=price_to)
        if object_type:
            queryset = queryset.filter(property_type=object_type)
        if beach_distance_from:
            queryset = queryset.filter(beach_distance__gte=beach_distance_from)
        if beach_distance_to:
            queryset = queryset.filter(beach_distance__lte=beach_distance_to)

        # Получаем параметр сортировки
        sort_by = self.request.GET.get('sort_by')
        if sort_by == 'name':
            queryset = queryset.order_by('name')
        elif sort_by == '-name':
            queryset = queryset.order_by('-name')
        elif sort_by == 'price':
            queryset = queryset.order_by('price_per_sqm')
        elif sort_by == '-price':
            queryset = queryset.order_by('-price_per_sqm')
        elif sort_by == 'date':
            queryset = queryset.order_by('created_at')
        elif sort_by == '-date':
            queryset = queryset.order_by('-created_at')
        else:
            # Сортировка по умолчанию
            queryset = queryset.order_by('-created_at')

        return queryset

    def get(self, request, pk=None, *args, **kwargs):
        if request.path.endswith('/add/'):
            # Форма добавления объекта
            form = ConstructionObjectForm()
            return render(request, self.template_name_form, {
                'form': form
            })

        if pk is not None:
            # Детальный просмотр объекта
            obj = ConstructionObject.objects.get(pk=pk)
            other_objects = ConstructionObject.objects.filter(
                developer=request.user, is_published=True).exclude(pk=pk)
            return render(request, self.template_name_detail, {
                'other_objects': other_objects,
                'object': obj
            })

        if request.path.endswith('/favourites/'):
            # Просмотр избранных объектов
            context = {
                'favourite_objects': request.user.favourite_objects.all(),
                'favourite_developers': request.user.favourite_developers.all()
            }
            return render(request, self.template_name_favourites, context)

        # Список объектов (по умолчанию)
        objects = self.get_queryset()
        context = {
            'construction_objects': objects,
            'search_form': EstateSearchForm(request.GET),
            'user': request.user,
            'current_sort': self.request.GET.get('sort_by', '')
        }
        return render(request, self.template_name_list, context)

    def post(self, request, pk=None, *args, **kwargs):
        if pk is not None:
            # Редактирование существующего объекта
            obj = ConstructionObject.objects.get(pk=pk)
            form = ConstructionObjectForm(
                request.POST, request.FILES, instance=obj)
        else:
            # Создание нового объекта
            form = ConstructionObjectForm(request.POST, request.FILES)

        if form.is_valid():
            try:
                obj = form.save(commit=False)
                if not pk:  # Только для новых объектов
                    obj.developer = request.user
                    obj.is_published = False
                obj.save()

                # Обработка загруженных изображений
                images = request.FILES.getlist('images')
                for image in images:
                    ConstructionObjectImage.objects.create(
                        construction_object=obj,
                        image=image
                    )

                messages.success(
                    request,
                    'Объект успешно обновлен' if pk else 'Объект успешно добавлен'
                )
                return redirect('users:object_list')
            except Exception as e:
                messages.error(
                    request, f'Ошибка при сохранении объекта: {str(e)}')
                return render(request, self.template_name_form, {
                    'form': form
                })
        else:
            # Если форма не валидна, показываем ошибки
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f'{field}: {error}')
            return render(request, self.template_name_form, {
                'form': form
            })


@require_POST
def toggle_favourite(request, pk):
    """
    Добавление/удаление объекта из избранного
    """
    try:
        object = get_object_or_404(ConstructionObject, pk=pk)

        # Проверяем наличие связи в промежуточной таблице
        is_favourite = request.user._favourite_objects.filter(
            pk=object.pk).exists()

        if is_favourite:
            # Удаляем запись из промежуточной таблицы
            request.user._favourite_objects.through.objects.filter(
                customuser=request.user,
                constructionobject=object
            ).delete()
            is_favourite = False
        else:
            # Создаем новую запись в промежуточной таблице
            request.user._favourite_objects.through.objects.create(
                customuser=request.user,
                constructionobject=object
            )
            is_favourite = True
        return JsonResponse({'is_favourite': is_favourite})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@require_POST
def toggle_favourite_developer(request, pk):
    """
    Добавление/удаление застройщика из избранного
    """
    try:
        developer = get_object_or_404(CustomUser, pk=pk, role='developer')

        is_favourite = request.user._favourite_developers.filter(
            pk=developer.pk).exists()

        if is_favourite:
            request.user._favourite_developers.through.objects.filter(
                from_customuser=request.user,
                to_customuser=developer
            ).delete()
            is_favourite = False
        else:
            request.user._favourite_developers.through.objects.create(
                from_customuser=request.user,
                to_customuser=developer
            )
            is_favourite = True
        return JsonResponse({'is_favourite': is_favourite})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


class ObjectRegistrationView(LoginRequiredMixin, ListView):
    """
    Представление для просмотра зарегистрированных объектов
    """
    model = ConstructionObject
    template_name = 'profile/object_registration.html'
    context_object_name = 'objects'
    paginate_by = 10

    def get_queryset(self):
        queryset = ConstructionObject.objects.filter(
            developer=self.request.user)

        # Фильтрация по статусу публикации
        status = self.request.GET.get('status')
        if status == 'published':
            queryset = queryset.filter(is_published=True)
        elif status == 'unpublished':
            queryset = queryset.filter(is_published=False)

        # Фильтрация по дате сдачи
        completion_date = self.request.GET.get('completion_date')
        if completion_date:
            queryset = queryset.filter(completion_date=completion_date)

        # Сортировка
        sort_by = self.request.GET.get('sort_by', 'newest')
        if sort_by == 'oldest':
            queryset = queryset.order_by('created_at')
        elif sort_by == 'newest':
            queryset = queryset.order_by('-created_at')
        else:
            # По умолчанию сортируем по новым
            queryset = queryset.order_by('-created_at')

        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['status_filter'] = self.request.GET.get('status', '')
        context['completion_date'] = self.request.GET.get(
            'completion_date', '')
        context['sort_by'] = self.request.GET.get('sort_by', 'newest')
        return context

    def post(self, request, *args, **kwargs):
        if 'toggle_publish' in request.POST:
            object_id = request.POST.get('object_id')
            try:
                obj = ConstructionObject.objects.get(
                    id=object_id, developer=request.user)
                obj.is_published = not obj.is_published
                obj.save()
                return JsonResponse({
                    'success': True,
                    'is_published': obj.is_published
                })
            except ConstructionObject.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'error': 'Объект не найден'
                }, status=404)
        return super().post(request, *args, **kwargs)


class DeveloperCatalogView(LoginRequiredMixin, ListView):
    """
    Список всех застройщиков:
    - Выводит пользователей с role='developer'
    - Поддерживает поиск по стране и названию компании
    - Поддерживает сортировку по имени и дате регистрации
    """
    model = CustomUser
    template_name = 'profile/developer_catalog.html'
    context_object_name = 'developers'
    paginate_by = 12

    def get_queryset(self):
        queryset = CustomUser.objects.filter(role='developer')

        # Получаем параметры поиска
        country = self.request.GET.get('country')
        search = self.request.GET.get('search')

        # Применяем фильтры поиска
        if country:
            queryset = queryset.filter(country__name__icontains=country)

        if search:
            queryset = queryset.filter(company_name__icontains=search)

        # Получаем параметр сортировки из URL
        sort = self.request.GET.get('sort')

        # Применяем сортировку в зависимости от параметра
        if sort == 'name_asc':
            queryset = queryset.order_by('company_name')
        elif sort == 'name_desc':
            queryset = queryset.order_by('-company_name')
        elif sort == 'date_asc':
            queryset = queryset.order_by('date_joined')
        elif sort == 'date_desc':
            queryset = queryset.order_by('-date_joined')
        else:
            # Сортировка по умолчанию
            queryset = queryset.order_by('-date_joined')

        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sort'] = self.request.GET.get('sort')
        # Добавляем параметры поиска в контекст для сохранения значений в форме
        context['search_params'] = {
            'country': self.request.GET.get('country', ''),
            'search': self.request.GET.get('search', '')
        }
        return context


class DeveloperDetailView(LoginRequiredMixin, DetailView):
    model = CustomUser
    template_name = 'profile/developer_detail.html'
    context_object_name = 'developer'

    def get_queryset(self):
        queryset = CustomUser.objects.filter(role='developer')
        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Получаем всех застройщиков кроме текущего
        developers = self.get_queryset().exclude(id=self.kwargs['pk'])
        context['developers'] = developers
        return context


class ProfileFinanceView(LoginRequiredMixin, View):
    """
    Представление для страницы финансов в профиле:
    - Отображение текущего баланса
    - Информация о подписке
    - История финансовых операций
    - Доступные тарифы
    - Форма создания счета
    """
    template_name = 'profile/finance.html'

    def get_context_data(self, **kwargs):
        user = self.request.user
        subscription = Subscription.objects.filter(
            user=user,
            is_active=True
        ).first()
        
        if subscription:
            subscription.days_left = (subscription.end_date - timezone.now()).days
        
        return {
            'user': user,
            'subscription': subscription,
            'operations': FinancialOperation.objects.filter(user=user)[:10],
            'plans': SubscriptionPlan.objects.filter(is_active=True),
            'form': InvoiceForm()
        }

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name, self.get_context_data())

    def post(self, request, *args, **kwargs):
        form = InvoiceForm(request.POST)
        if form.is_valid():
            # TODO: Добавить логику создания счета
            messages.success(request, "Счет успешно создан")
            return redirect('users:profile_finance')
        else:
            messages.error(request, "Ошибка при создании счета")
        
        context = self.get_context_data()
        context['form'] = form
        return render(request, self.template_name, context)
