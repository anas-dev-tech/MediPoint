from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import Doctor

# Dictionary to store the previous state of Doctor instances
doctor_previous_state = {}

@receiver(pre_save, sender=Doctor)
def track_previous_state(sender, instance, **kwargs):
    """
    Store the previous state of the Doctor instance before saving.
    """
    if instance.pk:  # Ensure the instance is being updated, not created
        try:
            previous = Doctor.objects.get(pk=instance.pk)
            doctor_previous_state[instance.pk] = previous
        except Doctor.DoesNotExist:
            pass  # Handle the case where the instance doesn't exist (e.g., during creation)

        
@receiver(post_save, sender=Doctor)
def send_verification_email(sender, instance, **kwargs):
    """
    Send an email to the doctor when their is_verified field is updated from False to True.
    """
    if instance.pk:  # Ensure the instance is being updated, not created
        previous = doctor_previous_state.get(instance.pk)
        if previous and not previous.is_verified and instance.is_verified:
            # Send email only if is_verified changed from False to True
            subject = 'Your Account Has Been Verified'
            message = f'Dear {instance.user.full_name},\n\nYour account has been verified. You can now access all features of our platform.\n\nThank you!'
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [instance.user.email]  # Assuming the Doctor model has a related User model

            send_mail(subject, message, from_email, recipient_list, fail_silently=False)
        
        # Clean up the previous state from the dictionary
        doctor_previous_state.pop(instance.pk, None)