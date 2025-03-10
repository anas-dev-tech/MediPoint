# settings/local.py
from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# Allowed hosts for local development
# settings.py

ALLOWED_HOSTS = ['164.92.161.163', 'localhost', '127.0.0.1']

# Database (use SQLite or another local database)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
CORS_ALLOWED_ORIGINS = [
    "http://164.92.161.163:4174",
    "http://164.92.161.163:4173",  # Example: Allow requests from a React app running on port 3000
]

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# Static files (optional for local development)
STATICFILES_DIRS = [BASE_DIR / 'static']


# ####################
# # Mailbit #########
# ##################
# EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
# EMAIL_HOST = "localhost"  # Mailpit SMTP server
# EMAIL_PORT = 1025  # Mailpit SMTP port
# EMAIL_USE_TLS = False  # Mailpit does not use TLS
# EMAIL_HOST_USER = ""  # Leave empty for Mailpit
# EMAIL_HOST_PASSWORD = ""  # Leave empty for Mailpit
# DEFAULT_FROM_EMAIL = "GenYe@example.com"  # Set your default sender email

EMAIL_BACKEND = "anymail.backends.mailjet.EmailBackend"  # or sendgrid.EmailBackend, or...
ANYMAIL = {
    # (exact settings here depend on your ESP...)
    "MAILJET_API_KEY": env("EMAIL_API_KEY"),
    "MAILJET_SECRET_KEY": env("EMAIL_SECRET_KEY"),  # your Mailgun domain, if needed
}
DEFAULT_FROM_EMAIL = "medipoint@decodaai.com"  # if you don't already have this in settings

# SERVER_EMAIL = ""  # ditto (default from-email for Django errors)



# Celery settings for local development
CELERY_BROKER_URL = 'redis://127.0.0.1:6379/0'
CELERY_BEAT_SCHEDULER = "django_celery_beat.schedulers:DatabaseScheduler"

CELERY_RESULT_BACKEND = 'redis://127.0.0.1:6379/0'

DBBACKUP_STORAGE_OPTIONS = {'location': '/home/MediPoint/medipoint_db/'}



