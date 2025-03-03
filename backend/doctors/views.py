from django.shortcuts import render
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


class SpecialtyListAPIView(generics.ListAPIView):
    queryset = Specialty.objects.all()
    serializer_class = SpecialtySerializer


class DoctorViewSets(viewsets.ModelViewSet):
    http_method_names = ["post", "get", "put", "patch"]
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_class = DoctorFilter

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

        total_patient = appointments.aggregate(total_patients=Count("patient", distinct=True))["total_patients"]
        latest_appointment = appointments.order_by("-working_hours__start_time")[
            :10
        ]

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

    def get_queryset(self):
        # Filter schedules by the doctor_pk from the URL
        doctor_pk = self.kwargs["doctor_pk"]
        return Schedule.objects.filter(doctor_id=doctor_pk)


class WorkingHoursViewSet(viewsets.ModelViewSet):
    serializer_class = WorkingHoursSerializer

    def get_queryset(self):
        # Filter schedules by the doctor_pk from the URL
        doctor_pk = self.kwargs["doctor_pk"]
        return WorkingHours.objects.upcoming().filter(doctor_id=doctor_pk)
