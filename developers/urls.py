from django.urls import path
from .views import DeveloperDetailView, ConstructionObjectListView, \
    ConstructionObjectDetailView, add_construction_object, \
    DeveloperObjectsStatusView, edit_developer_profile

urlpatterns = [
    path('<int:pk>/', DeveloperDetailView.as_view(), name='developer_detail'),
    path('<int:developer_id>/edit/', edit_developer_profile,
         name='edit_developer_profile'),
    path('objects/', ConstructionObjectListView.as_view(),
         name='construction_object_list'),
    path('objects/add/', add_construction_object,
         name='add_construction_object'),
    path('objects/status/', DeveloperObjectsStatusView.as_view(),
         name='developer_objects_status'),
    path('objects/<int:pk>/', ConstructionObjectDetailView.as_view(),
         name='construction_object_detail'),

]
