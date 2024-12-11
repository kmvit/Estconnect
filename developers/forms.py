from django import forms
from .models import ConstructionObject, ConstructionObjectImage


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
