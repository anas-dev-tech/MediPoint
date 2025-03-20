# MediPoint - AI-Powered Doctor Appointment Booking System

## Overview
MediPoint is an AI-powered doctor appointment booking system that provides patients with an initial diagnosis and recommends the appropriate doctor specialty they need. The system consists of multiple components, including a backend API, an admin dashboard, and separate React applications for patients and doctors.

## Features
- **AI-Based Initial Diagnosis**: Uses AI to provide an initial assessment of patient symptoms.
- **Specialty Recommendation**: Suggests the correct doctor specialty based on AI analysis.
- **Django Backend**: REST API built with Django and Django REST Framework.
- **Admin Dashboard**: A Django-based administration panel.
- **React Applications**:
  - Patient App: Allows patients to book appointments.
  - Doctor App: Enables doctors to manage their schedules and appointments.
- **PostgreSQL Database**: Used for storing patient, doctor, and appointment data.
- **Redis Caching**: Implements caching for improved performance.
- **Dockerized Deployment**: Easily deployable with Docker in a single command.
- **Stripe Integration**: Secure online payment processing for appointments.
- **Nginx Proxy & Web Server**:
  - Serves as a proxy for the backend.
  - Hosts the frontend applications.
- **Backup Strategy**:
  - Database backups can be made using:
    ```sh
    python manage.py dbbackup
    ```
  - Backups can also be scheduled periodically via the admin dashboard.
- **Doctor Appointment Scheduling**:
  - Admins can set doctor schedules through the admin dashboard.
  - Celery is used for handling periodic scheduling tasks.

## Technologies Used
- **Backend**: Django, Django REST Framework
- **Frontend**: React (Separate apps for Patients and Doctors)
- **Database**: PostgreSQL
- **Caching**: Redis
- **Containerization**: Docker
- **Proxy & Web Server**: Nginx
- **Payment Processing**: Stripe API
- **Task Scheduling**: Celery

## Installation & Setup
### Prerequisites
Ensure you have the following installed:
- Docker & Docker Compose
- nodejs and npm > v20 

### Deployment
1. Clone the repository:
   ```sh
   git clone https://github.com/anas-dev-tech/MediPoint.git
   cd MediPoint
   ```
2. Set up the required API keys and secret environment variables. Create a `.env.production` for production  file in the `backend` folder and add your configurations:
   ```sh
   DJANGO_SECRET_KEY=your_secret_key
   STRIPE_SECRET_KEY=your_stripe_secret
   REDIS_URL=redis://your_redis_url
   DATABASE_URL=postgres://your_db_url
   
   EMAIL_SECRET_KEY=your_mailjet_secret
   EMAIL_API_KEY=your_mailjet_api

   POSTGRES_DB=MediPoint
   POSTGRES_USER=username
   POSTGRES_PASSWORD=password

   GOOGLE_API_KEY=

   STRIPE_SECRET_KEY=
   STRIPE_PUBLIC_KEY=
   STRIPE_WEBHOOK_KEY=
   
   CORS_ALLOWED_ORIGINS=domain_name_for_frontend
   ALLOWED_HOSTS=domain_name_for_backend

   ```
3. You need also to set up the domain name in Patient and Doctor React apps
  ```sh
    VITE_API_BASE_URL=               # for example https://medipoint.decodaai.com/api
  ```

4. Start the application using `./setup` bash scripts:
   ```sh
   ./setup.sh
   ```
5. The system will be up and running with all services properly configured.

## Usage
- Patients can sign up, enter their symptoms, receive AI-based recommendations, and book an appointment with the suggested doctor.
- Doctors can manage their availability and appointments through the doctor portal.
- Admins can oversee the system via the Django admin dashboard, including managing backups and scheduling doctor appointments.

## Contributing
Feel free to submit pull requests or raise issues for improvements!

## Contact
For any inquiries, reach out to anasalwardtech@gmail.com .

