import re

from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.utils.translation import gettext_lazy as _
from .models import CustomUser
from locations.models import Country


class CustomUserCreationForm(UserCreationForm):
    """
    Форма регистрации
    """
    username = forms.CharField(
        label="Логин",
        widget=forms.TextInput(attrs={
            'class': 'input',
            'placeholder': 'Логин'
        })
    )
    
    email = forms.EmailField(
        label="Email",
        widget=forms.EmailInput(attrs={
            'class': 'input',
            'placeholder': 'Email'
        })
    )
    
    password1 = forms.CharField(
        label="Пароль",
        widget=forms.PasswordInput(attrs={
            'class': 'input',
            'placeholder': 'Пароль'
        })
    )
    
    password2 = forms.CharField(
        label="Подтверждение пароля",
        widget=forms.PasswordInput(attrs={
            'class': 'input',
            'placeholder': 'Повторите пароль'
        })
    )

    phone = forms.CharField(
        label="Телефон",
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'input',
            'placeholder': 'Телефон'
        })
    )

    country = forms.ModelChoiceField(
        label="Страна",
        queryset=Country.objects.all(),
        empty_label="Выберите страну",
        widget=forms.Select(attrs={
            'class': 'input country-select'
        })
    )

    class Meta:
        model = CustomUser
        fields = [
            'role', 'username', 'email', 'password1', 'password2',
            'company_name', 'country', 'legal_address', 'phone', 'website',
        ]
        widgets = {
            'role': forms.RadioSelect(attrs={
                'class': 'role-radio'
            }),
            'company_name': forms.TextInput(attrs={
                'class': 'input',
                'placeholder': 'Название компании'
            }),
            'legal_address': forms.TextInput(attrs={
                'class': 'input',
                'placeholder': 'Юридический адрес'
            }),
            'website': forms.URLInput(attrs={
                'class': 'input',
                'placeholder': 'Веб-сайт'
            })
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['role'].choices = [
            choice for choice in CustomUser.ROLE_CHOICES if
            choice[0] != 'admin'
        ]
        # Делаем некоторые поля необязательными
        optional_fields = ['company_name', 'legal_address', 'website']
        for field in optional_fields:
            self.fields[field].required = False

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
            'first_name',
            'last_name',
            'email',
            'phone',
            'company_name',
            'language',
            'preferred_contact_method',
            'profile_photo',
            'image'
        ]
        widgets = {
            'first_name': forms.TextInput(attrs={
                'class': 'input estate-search-form-item-input',
                'placeholder': 'Имя'
            }),
            'last_name': forms.TextInput(attrs={
                'class': 'input estate-search-form-item-input',
                'placeholder': 'Фамилия'
            }),
            'email': forms.EmailInput(attrs={
                'class': 'input estate-search-form-item-input',
                'placeholder': 'example@mail.ru'
            }),
            'phone': forms.TextInput(attrs={
                'class': 'input estate-search-form-item-input',
                'placeholder': '+7 (999) 999-99-99'
            }),
            'company_name': forms.TextInput(attrs={
                'class': 'input estate-search-form-item-input',
                'placeholder': 'Название компании'
            }),
            'language': forms.Select(attrs={
                'class': 'input estate-search-form-item-input profile_language-dropdown-button'
            }, choices=[('ru', 'Русский'), ('en', 'English')]),
            'preferred_contact_method': forms.Select(attrs={
                'class': 'input estate-search-form-item-input profile_communication-dropdown-button'
            }, choices=[('email', 'Электронная почта'), ('phone', 'Телефон')]),
            'profile_photo': forms.FileInput(attrs={
                'class': 'profile_logo-add',
                'accept': 'image/*',
                'style': 'display: none;'
            }),
            'image': forms.FileInput(attrs={
                'class': 'profile_banner-add',
                'accept': 'image/*',
                'style': 'display: none;'
            })
        }

    def clean_profile_photo(self):
        photo = self.cleaned_data.get('profile_photo')
        if photo:
            # Проверяем размер файла (например, максимум 5MB)
            if photo.size > 5 * 1024 * 1024:
                raise forms.ValidationError("Размер файла не должен превышать 5MB")
            
            # Проверяем расширение файла
            allowed_extensions = ['jpg', 'jpeg', 'png']
            ext = photo.name.split('.')[-1].lower()
            if ext not in allowed_extensions:
                raise forms.ValidationError("Поддерживаются только форматы: jpg, jpeg, png")
        
        return photo

    def clean_image(self):
        image = self.cleaned_data.get('image')
        if image:
            if image.size > 5 * 1024 * 1024:
                raise forms.ValidationError("Размер файла не должен превышать 5MB")
            
            allowed_extensions = ['jpg', 'jpeg', 'png']
            ext = image.name.split('.')[-1].lower()
            if ext not in allowed_extensions:
                raise forms.ValidationError("Поддерживаются только форматы: jpg, jpeg, png")
        return image


class EstateSearchForm(forms.Form):
    """
    Форма для поиска объектов недвижимости
    """
    country = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'input estate-search-form-item-input',
            'placeholder': 'Таиланд'
        }),
        label='Местонахождение объекта'
    )
    
    name = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'input estate-search-form-item-input',
            'placeholder': 'Введите название ЖК'
        }),
        label='Название объекта'
    )
    
    developer = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'input estate-search-form-item-input',
            'placeholder': 'Введите название застройщика'
        }),
        label='Название застройщика'
    )
    
    price_from = forms.DecimalField(
        required=False,
        widget=forms.NumberInput(attrs={
            'class': 'input estate-search-form-item-input estate-search-form-item-price-item',
            'placeholder': 'От'
        }),
        label='Цена от'
    )
    
    price_to = forms.DecimalField(
        required=False,
        widget=forms.NumberInput(attrs={
            'class': 'input estate-search-form-item-input estate-search-form-item-price-item',
            'placeholder': 'До'
        }),
        label='Цена до'
    )
    
    price_currency = forms.ChoiceField(
        choices=[
            ('THB', 'THB'),
            ('USD', 'USD'),
            ('RUB', 'RUB'),
            ('UK', 'UK')
        ],
        initial='THB',
        required=False,
        widget=forms.Select(attrs={
            'class': 'input estate-search-form-item-input',
            'style': 'display: none;'
        }),
        label='Валюта'
    )
    
    object_type = forms.ChoiceField(
        choices=[
            ('', '- выберите -'),
            ('apartment', 'Квартира'),
            ('house', 'Дом'),
            ('land', 'Участок'),
            ('commercial', 'Коммерческая недвижимость')
        ],
        required=False,
        widget=forms.Select(attrs={
            'class': 'input estate-search-form-item-input',
            'style': 'display: none;'
        }),
        label='Тип объекта'
    )
    
    beach_distance_from = forms.IntegerField(
        required=False,
        widget=forms.NumberInput(attrs={
            'class': 'input estate-search-form-item-input estate-search-form-item-price-item',
            'placeholder': 'От'
        }),
        label='Расстояние до пляжа от'
    )
    
    beach_distance_to = forms.IntegerField(
        required=False,
        widget=forms.NumberInput(attrs={
            'class': 'input estate-search-form-item-input estate-search-form-item-price-item',
            'placeholder': 'До'
        }),
        label='Расстояние до пляжа до'
    )
    
    beach_distance_unit = forms.ChoiceField(
        choices=[
            ('meters', 'Метров'),
            ('kilometers', 'Километров')
        ],
        initial='meters',
        required=False,
        widget=forms.Select(attrs={
            'class': 'input estate-search-form-item-input',
            'style': 'display: none;'
        }),
        label='Единица измерения'
    )


class InvoiceForm(forms.Form):
    """
    Форма для создания счета
    """
    COUNTRY_CHOICES = [
        ('thailand', _('Таиланд')),
        ('vietnam', _('Вьетнам')),
        ('cambodia', _('Камбоджа')),
        ('indonesia', _('Индонезия')),
        ('malaysia', _('Малайзия')),
    ]

    PAYMENT_METHOD_CHOICES = [
        ('bank_transfer', _('Банковский перевод')),
        ('credit_card', _('Кредитная карта')),
        ('crypto', _('Криптовалюта')),
    ]

    country = forms.ChoiceField(
        choices=COUNTRY_CHOICES,
        label=_('Страна'),
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    payment_method = forms.ChoiceField(
        choices=PAYMENT_METHOD_CHOICES,
        label=_('Способ оплаты'),
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    invoice_email = forms.EmailField(
        label=_('Email для счета'),
        widget=forms.EmailInput(attrs={
            'class': 'input form-control',
            'placeholder': 'Введите email для счета'
        })
    )
