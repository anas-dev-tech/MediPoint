from rest_framework.routers import DefaultRouter
from .views import PatientViewSets
from django.urls import path, include

router = DefaultRouter()

router.register(r'patients', PatientViewSets)


patient_routes = [
    path('', include(router.urls))
]