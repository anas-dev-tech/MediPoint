from rest_framework import viewsets

from .models import Patient
from .serializers import PatientSerializer


class PatientViewSets(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    http_method_names = ['get', 'post',]
    
    def get_serializer(self, *args, **kwargs):
        # Pass the request context to the serializer
        kwargs['context'] = {'request': self.request}
        return super().get_serializer(*args, **kwargs)
    
    
    
    