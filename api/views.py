from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.utils.translation import gettext_lazy as _
from django.templatetags.static import static

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
