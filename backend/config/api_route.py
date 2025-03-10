from django.urls import path, include
from doctors.urls import doctor_routes
from patients.urls import patient_routes
from appointments.urls import appointment_routes
from chatbot.urls import chatbot_routes
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

urlpatterns = [
    path('auth/', include('auth.urls')),
] + doctor_routes + patient_routes + appointment_routes + chatbot_routes


# Schema view for Swagger/OpenAPI
schema_view = get_schema_view(
    openapi.Info(
        title="MediPoint",
        default_version='v1',
        description="API documentation for MediPoint",
        terms_of_service="https://www.example.com/terms/",
        contact=openapi.Contact(email="anasalwardtech@gmail.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.IsAdminUser,)
)

urlpatterns += [
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
  ]