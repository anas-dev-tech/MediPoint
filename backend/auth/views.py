from icecream import ic
from django.contrib.auth import get_user_model

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, views
from rest_framework import generics
from rest_framework_simplejwt.views import TokenObtainPairView

from doctors.serializers import DoctorSerializer
from patients.serializers import PatientSerializer
from users.serializers import UserSerializer
from .serializers import (
    CustomTokenObtainPairSerializer,
    RegisterSerializer,
    PasswordChangeSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer
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
        user = request.user

        if user.is_doctor():
            doctor_data = DoctorSerializer(
                user.doctor, context={"request": request}
            ).data
            return Response(doctor_data)

        if user.is_patient():
            patient_data = PatientSerializer(
                user.patient, context={"request": request}
            ).data
            return Response(patient_data)

        return Response(
            {"detail": "User is neither a doctor nor a patient."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def put(self, request):
        user = request.user

        ic(request.data)
        if user.is_doctor():
            doctor = user.doctor
            doctor_serializer = DoctorSerializer(
                doctor, data=request.data, partial=True
            )
            if doctor_serializer.is_valid():
                doctor_serializer.save()
                return Response(
                    {"message": "Doctor profile updated successfully"},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    doctor_serializer.errors, status=status.HTTP_400_BAD_REQUEST
                )

        elif user.is_patient():
            patient = user.patient
            patient_serializer = PatientSerializer(
                patient, data=request.data, partial=True
            )
            if patient_serializer.is_valid():
                patient_serializer.save()
                return Response(
                    {"message ": "Patient profile updated successfully"},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    patient_serializer.errors, status=status.HTTP_400_BAD_REQUEST
                )

        else:
            return Response(
                {"detail": "User is neither a doctor nor a patient."},
                status=status.HTTP_400_BAD_REQUEST,
            )

            # else:
            #     return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordChangeView(generics.UpdateAPIView):
    serializer_class = PasswordChangeSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        # Update password
        self.request.user.set_password(serializer.validated_data["new_password"])
        self.request.user.save()

        return Response(
            {"detail": "Password updated successfully"}, status=status.HTTP_200_OK
        )

from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.urls import reverse
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.conf import settings

class PasswordResetRequestView(APIView):
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = User.objects.get(email=serializer.validated_data['email'])
            except User.DoesNotExist:
                # wether email exists or not we should never tell the frontend user does not exist
                # this approach is more secure than telling them 
                return Response({"message": "Password reset link sent to email."}, status=status.HTTP_200_OK)

            token = default_token_generator.make_token(user)
            uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
            domain = request.data.get('domain', None)
            
            if not domain:
                return Response({"message": "Request password reset should contain domain"}, status=status.HTTP_400_BAD_REQUEST)
            
            reset_link = f"{domain}/password-reset/{uidb64}/{token}/"
            
            send_mail(
                "Password Reset Request",
                f"Click the link to reset your password: {reset_link}",
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )

            return Response({"message": "Password reset link sent to email."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetConfirmView(APIView):
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"message": "Password has been reset successfully."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
