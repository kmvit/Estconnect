import re

from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser


class CustomUserCreationForm(UserCreationForm):
    """
    Форма регистрации
    """
    phone = forms.CharField(
        label="Телефон",
        required=False,
        widget=forms.TextInput(attrs={'placeholder': 'Пример: 8XXXXXXXXXX'}),
    )

    class Meta:
        model = CustomUser
        fields = [
            'role', 'username', 'email', 'password1', 'password2',
            'company_name', 'country', 'legal_address', 'phone', 'website',
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['role'].choices = [
            choice for choice in CustomUser.ROLE_CHOICES if
            choice[0] != 'admin'
        ]

    # def clean_phone(self):
    #     phone = self.cleaned_data['phone']
    #     # Проверка формата телефона
    #     if not re.match(r'^8\d{9}$', phone):
    #         raise forms.ValidationError(
    #             "Телефон должен быть в формате: 8XXXXXXXXXX")
    #     return phone


class CustomLoginForm(forms.Form):
    """
    Форма авторизации
    """
    username = forms.CharField(
        label="Логин, телефон или email",
        max_length=255,
        required=True,
        widget=forms.TextInput(
            attrs={'placeholder': 'Логин, телефон (8XXXXXXXXXX) или email'}),
    )
    password = forms.CharField(
        label="Пароль",
        required=True,
        widget=forms.PasswordInput(attrs={'placeholder': 'Пароль'}),
    )


class UserProfileForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = [
            'company_name',
            'country',
            'city',
            'district',
            'legal_address',
            'phone',
            'website',
            'email',
            'fio',
            'preferred_contact_method',
            'contact_person',
            'image'
        ]
        widgets = {
            'company_name': forms.TextInput(attrs={'class': 'form-control'}),
            'legal_address': forms.Textarea(
                attrs={'class': 'form-control', 'rows': 3}),
            'phone': forms.TextInput(attrs={'class': 'form-control'}),
            'fio': forms.TextInput(attrs={'class': 'form-control'}),
            'email': forms.EmailInput(attrs={'class': 'form-control'}),
            'website': forms.URLInput(attrs={'class': 'form-control'}),
            'preferred_contact_method': forms.Select(
                attrs={'class': 'form-select'}),
            'contact_person': forms.TextInput(attrs={'class': 'form-control'}),
            'image': forms.FileInput(attrs={'class': 'form-control'}),
        }
