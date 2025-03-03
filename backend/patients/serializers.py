from rest_framework import serializers
from .models import Patient
from users.serializers import UserSerializer



class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False)
    class Meta:
        model = Patient
        fields = ['user']
    
    def update(self, instance, validated_data):
        # Handle nested user updates
        user_data = validated_data.pop("user", None)
        if user_data:
            user_serializer = UserSerializer(instance.user, data=user_data, partial=True)
            if user_serializer.is_valid():
                user_serializer.save()

        # Update Doctor fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance        
    