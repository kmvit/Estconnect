from django.http import HttpResponseForbidden
from django.urls import reverse


class RestrictAdminMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith(reverse('admin:index')):
            if request.user.groups.filter(name='CAM Managers').exists():
                return HttpResponseForbidden("Доступ запрещен.")

        return self.get_response(request)
