from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.forms import inlineformset_factory
from django.shortcuts import redirect, render, get_object_or_404
from django.views.generic import DetailView, ListView

from .forms import ConstructionObjectImageForm, ConstructionObjectForm, \
    DeveloperProfileForm
from .models import Developer, ConstructionObject, ConstructionObjectImage
import logging

logger = logging.getLogger(__name__)


# Страница застройщика
class DeveloperDetailView(DetailView):
    model = Developer
    template_name = 'developers/developer_detail.html'
    context_object_name = 'developer'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Добавляем объекты застройки в контекст
        context['construction_objects'] = ConstructionObject.objects.filter(
            developer=self.object, is_published=True)
        return context


@login_required
def edit_developer_profile(request, developer_id):
    """Редактирование профиля застройщика"""
    developer = get_object_or_404(Developer, id=developer_id)

    if developer.user != request.user:
        raise PermissionDenied  # Ограничиваем доступ только к своему профилю

    if request.method == 'POST':
        form = DeveloperProfileForm(request.POST, request.FILES, instance=developer)
        if form.is_valid():
            form.save()
            return redirect('developer_detail', pk=developer.id)
    else:
        form = DeveloperProfileForm(instance=developer)

    return render(request, 'developers/developer_edit.html', {'form': form, 'developer': developer})



class ConstructionObjectListView(ListView):
    model = ConstructionObject
    template_name = 'developers/construction_list.html'
    context_object_name = 'construction_objects'

    def get_queryset(self):
        # Базовый запрос: только опубликованные объекты
        queryset = ConstructionObject.objects.filter(is_published=True)

        # Получаем параметр сортировки из запроса
        sort_by = self.request.GET.get('sort_by', None)

        # Применяем сортировку в зависимости от значения sort_by
        if sort_by == 'price':
            queryset = queryset.order_by('price_per_sqm')  # Сортировка по цене
        elif sort_by == 'developer':
            queryset = queryset.order_by(
                'developer__name')  # Сортировка по застройщику
        elif sort_by == 'type':
            queryset = queryset.order_by(
                'housing_type__name')  # Сортировка по типу недвижимости

        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['current_sort'] = self.request.GET.get('sort_by', '')
        # Добавляем данные для карты
        context['map_data'] = list(
            ConstructionObject.objects.filter(latitude__isnull=False,
                                              longitude__isnull=False)
            .values('id', 'name', 'address', 'latitude', 'longitude')
        )
        return context


class ConstructionObjectDetailView(DetailView):
    model = ConstructionObject
    template_name = 'developers/construction_detail.html'
    context_object_name = 'construction_object'


@login_required
def add_construction_object(request):
    ImageFormSet = inlineformset_factory(
        ConstructionObject,
        ConstructionObjectImage,
        form=ConstructionObjectImageForm,
        extra=3,  # Количество пустых форм для добавления
        can_delete=True
    )

    if request.method == 'POST':
        form = ConstructionObjectForm(request.POST)
        if form.is_valid():
            obj = form.save(commit=False)
            obj.developer = request.user.developer_profile
            obj.is_published = False  # Устанавливаем статус "Не опубликован"
            obj.save()

            formset = ImageFormSet(request.POST, request.FILES, instance=obj)
            if formset.is_valid():
                formset.save()
                return redirect('developer_objects_status')
        else:
            formset = ImageFormSet(request.POST, request.FILES)
    else:
        form = ConstructionObjectForm()
        formset = ImageFormSet()

    return render(request, 'developers/add_object.html',
                  {'form': form, 'formset': formset})


class DeveloperObjectsStatusView(ListView):
    template_name = 'developers/objects_status.html'
    context_object_name = 'objects'

    def get_queryset(self):
        return ConstructionObject.objects.filter(
            developer=self.request.user.developer_profile)
