from rest_framework import viewsets
from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from .models import Doctor, Schedule, WorkingHours, Specialty
from django.db.models import Sum, Count
from .serializers import DoctorSerializer, ScheduleSerializer, WorkingHoursSerializer
from .permissions import IsOwnerOrReadOnly
from .serializers import DoctorSerializer, SpecialtySerializer
from .filters import DoctorFilter
from rest_framework.response import Response
from rest_framework import status
from appointments.serializers import AppointmentSerializer
from rest_framework.decorators import action
from icecream import ic
from appointments.models import Appointment
from .permissions import IsDoctor 
from rest_framework import serializers
from django.core.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated

class SpecialtyListAPIView(generics.ListAPIView):
    queryset = Specialty.objects.all()
    serializer_class = SpecialtySerializer


class DoctorViewSets(viewsets.ReadOnlyModelViewSet):
    queryset = Doctor.available.all()
    serializer_class = DoctorSerializer
    permission_classes = [IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_class = DoctorFilter

    def get_queryset(self):
        queryset = Doctor.available.all()

        if self.action == "list":
            queryset = queryset.select_related("user", "specialty")
        elif self.action == "detail":
            queryset = queryset.select_related(
                "user", "specialty", "working_hours"
            )
        return queryset

    @action(detail=False, methods=["get"])
    def dashboard(self, request, pk=None):
        try:
            doctor = Doctor.objects.get(user=request.user)
        except Doctor.DoesNotExist:
            return Response(
                {"error": "Doctor does not exist"}, status=status.HTTP_404_NOT_FOUND
            )
        appointments = Appointment.objects.filter(doctor=doctor).select_related(
            "working_hours"
        )
        total_appointments = appointments.count()
        total_earning = appointments.aggregate(total_earnings=Sum("fees"))[
            "total_earnings"
        ]

        total_patient = appointments.aggregate(
            total_patients=Count("patient", distinct=True)
        )["total_patients"]
        latest_appointment = appointments.order_by("-working_hours__start_time")[:10]

        dashboard_data = {
            "total_earnings": total_earning,
            "total_patients": total_patient,
            "total_appointments": total_appointments,
            "latest_appointments": AppointmentSerializer(
                latest_appointment, context={"request": self.request}, many=True
            ).data,
        }
        return Response(dashboard_data, status=status.HTTP_200_OK)


class ScheduleViewSet(viewsets.ModelViewSet):
    serializer_class = ScheduleSerializer
    queryset = Schedule.objects.all()
    permission_classes = [IsAuthenticated, IsDoctor]
    
    def get_queryset(self):
        doctor = self.request.user.doctor
        queryset = Schedule.objects.filter(doctor=doctor)
        
        return queryset
    
    def perform_create(self, serializer):
        # Validate the model instance before saving
        try:
            instance = serializer.save()
            instance.full_clean()  # Call full_clean to trigger model-level validation
        except ValidationError as e:
            # Convert Django's ValidationError to DRF's ValidationError
            raise serializers.ValidationError(e.message_dict)
    
    def perform_update(self, serializer):
        # Validate the model instance before saving
        try:
            instance = serializer.save()
            instance.full_clean()  # Call full_clean to trigger model-level validation
        except ValidationError as e:
            # Convert Django's ValidationError to DRF's ValidationError
            raise serializers.ValidationError(e.message_dict)

class WorkingHoursViewSet(viewsets.ModelViewSet):
    serializer_class = WorkingHoursSerializer

    def get_queryset(self):
        # Filter schedules by the doctor_pk from the URL
        doctor_pk = self.kwargs["doctor_pk"]
        return WorkingHours.objects.upcoming().filter(doctor_id=doctor_pk)
