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
        label=_("Логин"),
        widget=forms.TextInput(attrs={
            'class': 'input',
            'placeholder': _('Логин')
        })
    )
    
    email = forms.EmailField(
        label=_("Email"),
        widget=forms.EmailInput(attrs={
            'class': 'input',
            'placeholder': _('Email')
        })
    )
    
    password1 = forms.CharField(
        label=_("Пароль"),
        widget=forms.PasswordInput(attrs={
            'class': 'input',
            'placeholder': _('Пароль')
        })
    )
    
    password2 = forms.CharField(
        label=_("Подтверждение пароля"),
        widget=forms.PasswordInput(attrs={
            'class': 'input',
            'placeholder': _('Повторите пароль')
        })
    )
    
    phone = forms.CharField(
        label=_("Телефон"),
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'input',
            'placeholder': _('Телефон')
        })
    )
    
    country = forms.ModelChoiceField(
        label=_("Страна"),
        queryset=Country.objects.all(),
        empty_label=_("Выберите страну"),
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
                'placeholder': _('Название компании')
            }),
            'legal_address': forms.TextInput(attrs={
                'class': 'input',
                'placeholder': _('Юридический адрес')
            }),
            'website': forms.URLInput(attrs={
                'class': 'input',
                'placeholder': _('Веб-сайт')
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
        # Обновляем плейсхолдеры для динамического перевода
        self.fields['username'].widget.attrs['placeholder'] = _('Логин')
        self.fields['email'].widget.attrs['placeholder'] = _('Email')
        self.fields['password1'].widget.attrs['placeholder'] = _('Пароль')
        self.fields['password2'].widget.attrs['placeholder'] = _('Повторите пароль')
        self.fields['phone'].widget.attrs['placeholder'] = _('Телефон')
        if 'company_name' in self.fields:
            self.fields['company_name'].widget.attrs['placeholder'] = _('Название компании')
        if 'legal_address' in self.fields:
            self.fields['legal_address'].widget.attrs['placeholder'] = _('Юридический адрес')
        if 'website' in self.fields:
            self.fields['website'].widget.attrs['placeholder'] = _('Веб-сайт')

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
        label=_("Логин, телефон или email"),
        max_length=255,
        required=True,
        widget=forms.TextInput(),
    )
    password = forms.CharField(
        label=_("Пароль"),
        required=True,
        widget=forms.PasswordInput(),
    )
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Устанавливаем плейсхолдеры для динамического перевода
        self.fields['username'].widget.attrs['placeholder'] = _('Логин, телефон (8XXXXXXXXXX) или email')
        self.fields['password'].widget.attrs['placeholder'] = _('Пароль')
        # Добавляем классы к виджетам
        self.fields['username'].widget.attrs['class'] = 'input'
        self.fields['password'].widget.attrs['class'] = 'input'


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
                'class': 'input estate-search-form-item-input'
            }),
            'last_name': forms.TextInput(attrs={
                'class': 'input estate-search-form-item-input'
            }),
            'email': forms.EmailInput(attrs={
                'class': 'input estate-search-form-item-input'
            }),
            'phone': forms.TextInput(attrs={
                'class': 'input estate-search-form-item-input'
            }),
            'company_name': forms.TextInput(attrs={
                'class': 'input estate-search-form-item-input'
            }),
            'language': forms.Select(attrs={
                'class': 'input estate-search-form-item-input profile_language-dropdown-button'
            }),
            'preferred_contact_method': forms.Select(attrs={
                'class': 'input estate-search-form-item-input profile_communication-dropdown-button'
            }, choices=[('email', _('Электронная почта')), ('phone', _('Телефон'))]),
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
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Устанавливаем плейсхолдеры для динамического перевода
        self.fields['first_name'].widget.attrs['placeholder'] = str(_('Имя'))
        self.fields['last_name'].widget.attrs['placeholder'] = str(_('Фамилия'))
        self.fields['email'].widget.attrs['placeholder'] = str(_('example@mail.ru'))
        self.fields['phone'].widget.attrs['placeholder'] = str(_('+7 (999) 999-99-99'))
        self.fields['company_name'].widget.attrs['placeholder'] = str(_('Название компании'))

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
            'class': 'input estate-search-form-item-input'
        }),
        label=_('Местонахождение объекта')
    )
    
    name = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'input estate-search-form-item-input'
        }),
        label=_('Название объекта')
    )
    
    developer = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'input estate-search-form-item-input'
        }),
        label=_('Название застройщика')
    )
    
    price_from = forms.DecimalField(
        required=False,
        widget=forms.NumberInput(attrs={
            'class': 'input estate-search-form-item-input estate-search-form-item-price-item'
        }),
        label=_('Цена от')
    )
    
    price_to = forms.DecimalField(
        required=False,
        widget=forms.NumberInput(attrs={
            'class': 'input estate-search-form-item-input estate-search-form-item-price-item'
        }),
        label=_('Цена до')
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
        label=_('Валюта')
    )
    
    object_type = forms.ChoiceField(
        choices=[
            ('', _('- выберите -')),
            ('apartment', _('Квартира')),
            ('house', _('Дом')),
            ('land', _('Участок')),
            ('commercial', _('Коммерческая недвижимость'))
        ],
        required=False,
        widget=forms.Select(attrs={
            'class': 'input estate-search-form-item-input',
            'style': 'display: none;'
        }),
        label=_('Тип объекта')
    )
    
    beach_distance_from = forms.IntegerField(
        required=False,
        widget=forms.NumberInput(attrs={
            'class': 'input estate-search-form-item-input estate-search-form-item-price-item'
        }),
        label=_('Расстояние до пляжа от')
    )
    
    beach_distance_to = forms.IntegerField(
        required=False,
        widget=forms.NumberInput(attrs={
            'class': 'input estate-search-form-item-input estate-search-form-item-price-item'
        }),
        label=_('Расстояние до пляжа до')
    )
    
    beach_distance_unit = forms.ChoiceField(
        choices=[
            ('meters', _('Метров')),
            ('kilometers', _('Километров'))
        ],
        initial='meters',
        required=False,
        widget=forms.Select(attrs={
            'class': 'input estate-search-form-item-input',
            'style': 'display: none;'
        }),
        label=_('Единица измерения')
    )
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Устанавливаем плейсхолдеры для динамического перевода
        # LocaleMiddleware устанавливает язык для запроса, поэтому str(_('От')) переведет правильно
        self.fields['country'].widget.attrs['placeholder'] = str(_('Таиланд'))
        self.fields['name'].widget.attrs['placeholder'] = str(_('Введите название ЖК'))
        self.fields['developer'].widget.attrs['placeholder'] = str(_('Введите название застройщика'))
        self.fields['price_from'].widget.attrs['placeholder'] = str(_('От'))
        self.fields['price_to'].widget.attrs['placeholder'] = str(_('До'))
        self.fields['beach_distance_from'].widget.attrs['placeholder'] = str(_('От'))
        self.fields['beach_distance_to'].widget.attrs['placeholder'] = str(_('До'))


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
