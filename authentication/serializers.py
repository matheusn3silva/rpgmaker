from rest_framework import serializers
from authentication.models import User

class UserSerizalizer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user', 'password']