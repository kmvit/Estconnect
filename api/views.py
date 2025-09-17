from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from django.utils.translation import gettext_lazy as _, activate, check_for_language
from django.templatetags.static import static
from django.conf import settings

class HomePageAPIView(APIView):
    """
    API view для получения данных главной страницы.
    """
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        # build_absolute_uri нужен, чтобы Expo-приложение получило полные URL-адреса для изображений
        data = {
            'main_screen': {
                'title': _('Выход на международный рынок недвижимости'),
                'text_line_1': _('Эксклюзивные предложения'),
                'text_line_2': _('и безопасные сделки'),
                'button_text': _('Оставить заявку'),
                'image_url': request.build_absolute_uri(static('images/main-screen-img.png'))
            },
            'text_box': {
                'title': 'EstConnect',
                'text': _('EstConnect - digital сервис работы с объектами недвижимости по всему миру, который исключает риски и содействует быстрой интеграции в сегмент первичного риэлтерского рынка')
            },
            'work_areas': {
                'title': _('Три направления работы сервиса'),
                'items': [
                    {
                        'title': _('Каталог недвижимости'),
                        'image_url': request.build_absolute_uri(static('images/workAreas-img-1.png'))
                    },
                    {
                        'title': _('Юридический мониторинг'),
                        'image_url': request.build_absolute_uri(static('images/workAreas-img-2.png'))
                    },
                    {
                        'title': _('Прямые контракты с застройщиками'),
                        'image_url': request.build_absolute_uri(static('images/workAreas-img-3.png'))
                    }
                ]
            },
            'auth_cta': {
                'title': _('С нами продавать недвижимость просто!'),
                'login_button_text': _('Вход'),
                'register_button_text': _('Регистрация'),
            }
        }
        return Response(data)


class SetLanguageAPIView(APIView):
    """
    API view для смены языка приложения.
    Использует Django встроенную систему интернационализации.
    """
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        language_code = request.data.get('language')
        
        if not language_code:
            return Response(
                {'error': _('Код языка обязателен')}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Проверяем, поддерживается ли язык
        if not check_for_language(language_code):
            return Response(
                {'error': _('Неподдерживаемый код языка')}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Активируем язык для текущего запроса
        activate(language_code)
        
        # Устанавливаем язык в сессию
        request.session['django_language'] = language_code
        
        # Если пользователь аутентифицирован, обновляем его языковые настройки
        if request.user.is_authenticated:
            request.user.language = language_code
            request.user.save(update_fields=['language'])
        
        return Response({
            'message': _('Язык успешно изменен'),
            'language': language_code,
            'available_languages': dict(settings.LANGUAGES)
        })


class TranslateAPIView(APIView):
    """
    API для получения переводов строк (аналог {% trans %} для React Native)
    """
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        strings_to_translate = request.data.get('strings', [])
        language = request.session.get('django_language', 'ru')
        
        if check_for_language(language):
            activate(language)
        
        translations = {}
        for string in strings_to_translate:
            translations[string] = str(_(string))
        
        return Response({
            'language': language,
            'translations': translations
        })




