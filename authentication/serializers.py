from rest_framework import serializer
from authentication.models import User

class UserSerizalizer(serializer.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'