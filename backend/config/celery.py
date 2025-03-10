import os
from celery import Celery

# Determine the settings module based on the environment
env = os.getenv('ENVIRONMENT', 'local')  # Default to 'local' if not set
os.environ.setdefault('DJANGO_SETTINGS_MODULE', f'config.settings.{env}')

app = Celery('config')

# Configure Celery using settings from Django settings.py
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps
app.autodiscover_tasks()

# Debugging: Print the settings module being used
print(f"Using settings module: {os.environ['DJANGO_SETTINGS_MODULE']}")