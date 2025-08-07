from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls.i18n import i18n_patterns

from users.admin import cam_admin_site

# URL-паттерны, которые не требуют языкового префикса
urlpatterns = [
    path('api/v1/', include('api.urls', namespace='api')),
    path('i18n/', include('django.conf.urls.i18n')),
]

# URL-паттерны с языковыми префиксами
urlpatterns += i18n_patterns(
    path('cam-admin/', cam_admin_site.urls),
    path('admin/', admin.site.urls),
    path('users/', include(('users.urls', 'users'), namespace='users')),
    path('developers/', include('developers.urls')),
    path('support/', include('support.urls')),
    path('subscriptions/', include('subscriptions.urls')),
    path('', include('pages.urls')),
    prefix_default_language=True
)

# Подключение медиафайлов в режиме разработки
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
