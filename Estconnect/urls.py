from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', include('pages.urls')),  # Подключение маршрутов страниц
    path('users/', include('users.urls')),  # Пользовательские маршруты
    path('admin/', admin.site.urls),  # Админка
]
# Подключение медиафайлов в режиме разработки
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
