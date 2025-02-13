from django.contrib.auth.decorators import login_required
from django.forms import inlineformset_factory
from django.shortcuts import redirect, render
from django.views.generic import DetailView, ListView

from .forms import ConstructionObjectImageForm, ConstructionObjectForm
from .models import ConstructionObject, ConstructionObjectImage
import logging

logger = logging.getLogger(__name__)


class ConstructionObjectListView(ListView):
    model = ConstructionObject
    template_name = 'developers/construction_list.html'
    context_object_name = 'construction_objects'

    def get_queryset(self):
        qs = ConstructionObject.objects.filter(is_published=True)
        # Получаем параметр сортировки из запроса
        sort_by = self.request.GET.get('sort_by', None)
        if sort_by == 'price_desc':
            qs = qs.order_by('-price_per_sqm')
        elif sort_by == 'price_asc':
            qs = qs.order_by('price_per_sqm')
        elif sort_by == 'date_desc':
            qs = qs.order_by('-updated_at')
        elif sort_by == 'date_asc':
            qs = qs.order_by('updated_at')
        elif sort_by == 'square_asc':
            qs = qs.order_by('square')
        elif sort_by == 'square_desc':
            qs = qs.order_by('-square')
        else:
            # Сортировка по умолчанию (e.g. новые сначала)
            qs = qs.order_by('-updated_at')

        return qs

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
            obj.developer = request.user
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
            developer=self.request.user)
