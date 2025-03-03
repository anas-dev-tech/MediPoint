from django.db.models.signals import post_save
from django.dispatch import receiver
from doctors.models import Doctor
from patients.models import Patient
from .models import User

@receiver(post_save, sender=User)
def create_doctor_profile(sender, instance, created, **kwargs):
    """
    Signal to create a Doctor profile if the user's user_type is 'doctor'.
    """
    if created:
        if instance.is_doctor():
            Doctor.objects.create(user=instance)
        
        if instance.is_patient():
            Patient.objects.create(user=instance)
