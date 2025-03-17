from django import forms
from django.core.validators import FileExtensionValidator
from django.core.exceptions import ValidationError
from .models import ConstructionObject, ConstructionObjectImage
from PIL import Image
import os

def validate_image_size(value):
    # Проверка размера файла (4MB)
    if value.size > 4 * 1024 * 1024:
        raise ValidationError('Размер файла не должен превышать 4MB')
    
    # Проверка размеров изображения
    img = Image.open(value)
    width, height = img.size
    if width > 1600 or height > 3200:
        raise ValidationError('Размер изображения не должен превышать 1600px по ширине и 3200px по высоте')

class MultipleFileInput(forms.ClearableFileInput):
    allow_multiple_selected = True


class MultipleFileField(forms.FileField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault("widget", MultipleFileInput())
        super().__init__(*args, **kwargs)

    def clean(self, data, initial=None):
        single_file_clean = super().clean
        if isinstance(data, (list, tuple)):
            result = [single_file_clean(d, initial) for d in data]
        else:
            result = single_file_clean(data, initial)
        return result


class ConstructionObjectForm(forms.ModelForm):
    images = MultipleFileField(
        widget=MultipleFileInput(attrs={
            'class': 'file-upload-input',
            'accept': 'image/*',
            'id': 'photo'
        }),
        required=False,
        label='Фотографии',
        validators=[FileExtensionValidator(['jpg', 'jpeg', 'png'])]
    )

    class Meta:
        model = ConstructionObject
        fields = [
            'name', 'description', 'country', 'city', 'district',
            'property_type', 'comfort_type', 'amenities',
            'ownership_type', 'area', 'project_status',
            'completion_date', 'address', 'price_per_sqm'
        ]
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'input estate-search-form-item-input',
                'placeholder': 'Название объекта'
            }),
            'description': forms.Textarea(attrs={
                'class': 'input textarea object-plus-form-textarea',
                'placeholder': 'Описание объекта',
                'rows': 10,
                'cols': 30
            }),
            'country': forms.Select(attrs={
                'class': 'paymentMethod-dropdown-button-wrapper search-dropdown-button-wrapper',
                'placeholder': 'Выберите страну'
            }),
            'city': forms.Select(attrs={
                'class': 'paymentMethod-dropdown-button-wrapper search-dropdown-button-wrapper',
                'placeholder': 'Выберите город'
            }),
            'district': forms.Select(attrs={
                'class': 'paymentMethod-dropdown-button-wrapper search-dropdown-button-wrapper',
                'placeholder': 'Выберите район'
            }),
            'property_type': forms.Select(attrs={
                'class': 'paymentMethod-dropdown-button-wrapper search-dropdown-button-wrapper',
                'placeholder': 'Тип недвижимости'
            }),
            'comfort_type': forms.Select(attrs={
                'class': 'paymentMethod-dropdown-button-wrapper search-dropdown-button-wrapper',
                'placeholder': 'Комфорт'
            }),
            'price_per_sqm': forms.NumberInput(attrs={
                'class': 'input estate-search-form-item-input',
                'placeholder': 'Цена за м²'
            }),
            'ownership_type': forms.Select(attrs={
                'class': 'paymentMethod-dropdown-button-wrapper search-dropdown-button-wrapper',
                'placeholder': 'Тип права'
            }),
            'area': forms.NumberInput(attrs={
                'class': 'input estate-search-form-item-input',
                'placeholder': 'Площадь (м²)'
            }),
            'project_status': forms.Select(attrs={
                'class': 'paymentMethod-dropdown-button-wrapper search-dropdown-button-wrapper',
                'placeholder': 'Статус проекта'
            }),
            'completion_date': forms.DateInput(attrs={
                'class': 'input estate-search-form-item-input',
                'type': 'date',
                'placeholder': 'дд.мм.гггг'
            }),
            'address': forms.TextInput(attrs={
                'class': 'input estate-search-form-item-input',
                'placeholder': 'Адрес'
            }),
            'amenities': forms.Textarea(attrs={
                'class': 'input estate-search-form-item-input',
                'placeholder': 'Например: бассейн, парковка, охрана, детская площадка, фитнес-центр',
                'rows': 4
            })
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['amenities'].required = False
        self.fields['amenities'].help_text = 'Перечислите удобства через запятую (например: бассейн, парковка, охрана)'

    def clean_images(self):
        images = self.cleaned_data.get('images')
        if images:
            if isinstance(images, (list, tuple)):
                for image in images:
                    validate_image_size(image)
            else:
                validate_image_size(images)
        return images


class ConstructionObjectImageForm(forms.ModelForm):
    class Meta:
        model = ConstructionObjectImage
        fields = ['image']
        widgets = {
            'image': forms.FileInput(attrs={
                'class': 'image-input',
                'accept': 'image/*'
            })
        }
