from django.contrib.auth.decorators import login_required
from django.forms import inlineformset_factory
from django.shortcuts import redirect, render
from django.views.generic import DetailView, ListView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.contrib import messages
from django.views import View

from .forms import ConstructionObjectImageForm, ConstructionObjectForm
from .models import ConstructionObject, ConstructionObjectImage
import logging

logger = logging.getLogger(__name__)


class ConstructionObjectViewSet(LoginRequiredMixin, View):
    """
    ViewSet для работы с объектами недвижимости.
    Включает в себя:
    - список объектов
    - детальный просмотр
    - добавление объекта
    - редактирование объекта
    - удаление объекта
    """
    template_name_list = 'developers/object_list.html'
    template_name_detail = 'developers/construction_detail.html'
    template_name_form = 'developers/add_object.html'
    action = None

    @classmethod
    def as_view(cls, **initkwargs):
        view = super().as_view(**initkwargs)
        view.view_class = cls
        view.view_class.action = initkwargs.get('action')
        return view

    def get_formset_class(self):
        return inlineformset_factory(
            ConstructionObject,
            ConstructionObjectImage,
            form=ConstructionObjectImageForm,
            extra=3,
            can_delete=True
        )

    def get(self, request, pk=None, *args, **kwargs):
        if pk is not None:
            # Детальный просмотр объекта
            obj = ConstructionObject.objects.get(pk=pk)
            return render(request, self.template_name_detail, {
                'construction_object': obj
            })
        
        if self.action == 'add':
            # Форма добавления объекта
            form = ConstructionObjectForm()
            return render(request, self.template_name_form, {
                'form': form
            })
        
        # Список объектов
        objects = ConstructionObject.objects.filter(developer=request.user)
        context = {
            'construction_objects': objects,
            'current_sort': request.GET.get('sort_by', '')
        }
        return render(request, self.template_name_list, context)

    def post(self, request, pk=None, *args, **kwargs):
        if pk is not None:
            # Редактирование существующего объекта
            obj = ConstructionObject.objects.get(pk=pk)
            form = ConstructionObjectForm(request.POST, request.FILES, instance=obj)
        else:
            # Создание нового объекта
            form = ConstructionObjectForm(request.POST, request.FILES)

        if form.is_valid():
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
            return redirect('developers:object_list')
        else:
            messages.error(request, 'Пожалуйста, исправьте ошибки в форме')
            return render(request, self.template_name_form, {
                'form': form
            })

    def delete(self, request, pk, *args, **kwargs):
        obj = ConstructionObject.objects.get(pk=pk)
        obj.delete()
        messages.success(request, 'Объект успешно удален')
        return redirect('developers:object_list')


class DeveloperObjectsStatusView(ListView):
    template_name = 'developers/objects_status.html'
    context_object_name = 'objects'

    def get_queryset(self):
        return ConstructionObject.objects.filter(
            developer=self.request.user)
