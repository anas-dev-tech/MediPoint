#!/bin/bash

set -e

# Wait for the database to be ready
echo "Waiting for PostgreSQL to start..."
while ! nc -z db 5432; do
  sleep 1
done

echo "PostgreSQL started"

if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "Applying database migrations..."
  python manage.py makemigrations
  python manage.py migrate

  echo "Collecting static files..."
  python manage.py collectstatic --noinput
fi

# Execute the command passed in CMD (from docker-compose)
exec "$@"
