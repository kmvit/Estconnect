from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from users.admin import cam_admin_site

urlpatterns = [
    path('cam-admin/', cam_admin_site.urls),  # Админка КАМ-менеджера
    path('admin/', admin.site.urls),  # Админка
    path('users/', include(('users.urls', 'users'), namespace='users')),  # Пользовательские маршруты
    path('developers/', include('developers.urls')),
    # Пользовательские маршруты
    path('support/', include('support.urls')),
    path('', include('pages.urls')),  # Подключение маршрутов страниц
]
# Подключение медиафайлов в режиме разработки
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
