from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.conf import settings
from django.core.mail import send_mail
from django.urls import reverse
from rest_framework import status, generics, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView

from doctors.serializers import DoctorSerializer
from patients.serializers import PatientSerializer
from users.serializers import UserSerializer
from users.tasks import send_email_template
from .serializers import (
    CustomTokenObtainPairSerializer,
    RegisterSerializer,
    PasswordChangeSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
)

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {"message": "User registered successfully", "user_id": user.id},
            status=status.HTTP_201_CREATED,
        )


class MeView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = User.objects.filter(id=request.user.id).select_related("doctor", "patient").first()
        if not user:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        if user.is_doctor():
            return Response(DoctorSerializer(user.doctor, context={"request": request}).data)
        
        if user.is_patient():
            return Response(PatientSerializer(user.patient, context={"request": request}).data)

        return Response(
            {"detail": "User is neither a doctor nor a patient."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def put(self, request):
        user = request.user
        parsed_data = {}
        for key, value in request.data.items():
            if key.startswith("user"):
                new_key = key.replace("user", "").lstrip("[").rstrip("]")
                parsed_data.setdefault("user", {})[new_key] = value
            else:
                parsed_data[key] = value
        
        serializer_class = DoctorSerializer if user.is_doctor() else PatientSerializer if user.is_patient() else None
        if not serializer_class:
            return Response({"detail": "User is neither a doctor nor a patient."}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = serializer_class(user.doctor if user.is_doctor() else user.patient, data=parsed_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": f"{'Doctor' if user.is_doctor() else 'Patient'} profile updated successfully"}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordChangeView(generics.UpdateAPIView):
    serializer_class = PasswordChangeSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data["new_password"])
        request.user.save()
        return Response({"detail": "Password updated successfully"}, status=status.HTTP_200_OK)


class PasswordResetRequestView(views.APIView):
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"message": "Password reset link sent to email."}, status=status.HTTP_200_OK)

        domain = request.data.get('domain')
        if not domain:
            return Response({"message": "Request must contain domain."}, status=status.HTTP_400_BAD_REQUEST)
        
        reset_link = f"{domain}/password-reset/{urlsafe_base64_encode(force_bytes(user.pk))}/{default_token_generator.make_token(user)}/"
        send_email_template.delay(
            "Reset Your MediPoint Password",
            "emails/password_reset.html",
            {"user_name": user.full_name, "reset_link": reset_link, "support_email": "MediPoint@decodaai.com"},
            user.email,
        )
        return Response({"message": "Password reset link sent to email."}, status=status.HTTP_200_OK)


class PasswordResetConfirmView(views.APIView):
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        return Response({"message": "Password has been reset successfully."}, status=status.HTTP_200_OK)
