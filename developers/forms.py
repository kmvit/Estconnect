from django import forms
from .models import ConstructionObject, ConstructionObjectImage, Developer


class DeveloperProfileForm(forms.ModelForm):
    class Meta:
        model = Developer
        fields = [
            'name',
            'company',
            'image',
            'phone',
            'email',
            'contact_person',
            'preferred_contact_method',
        ]
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'company': forms.TextInput(attrs={'class': 'form-control'}),
            'phone': forms.TextInput(attrs={'class': 'form-control'}),
            'email': forms.EmailInput(attrs={'class': 'form-control'}),
            'contact_person': forms.TextInput(attrs={'class': 'form-control'}),
            'preferred_contact_method': forms.Select(attrs={'class': 'form-select'}),
        }
        labels = {
            'name': 'Название',
            'company': 'Компания',
            'image': 'Изображение',
            'phone': 'Номер телефона',
            'email': 'Почта',
            'contact_person': 'Контактное лицо',
            'preferred_contact_method': 'Предпочтительный канал связи',
        }


class ConstructionObjectForm(forms.ModelForm):
    class Meta:
        model = ConstructionObject
        fields = [
            'name', 'price_per_sqm', 'housing_class', 'housing_type',
            'address', 'completion_date', 'parking', 'country', 'city',
            'district',
            'buildings', 'floors', 'description'
        ]
        widgets = {
            'completion_date': forms.DateInput(attrs={
                'type': 'date',
                'class': 'form-control',
            }),
            'description': forms.Textarea(
                attrs={'rows': 3, 'class': 'form-control'}),
            'address': forms.TextInput(attrs={'class': 'form-control'}),
        }

    # country = forms.ModelChoiceField(
    #     queryset=Country.objects.all(),
    #     label="Страна",
    #     required=True
    # )
    # city = forms.ModelChoiceField(
    #     queryset=City.objects.none(),
    #     label="Город",
    #     required=False
    # )
    # district = forms.ModelChoiceField(
    #     queryset=District.objects.none(),
    #     label="Район",
    #     required=False
    # )


class ConstructionObjectImageForm(forms.ModelForm):
    class Meta:
        model = ConstructionObjectImage
        fields = ['image']
