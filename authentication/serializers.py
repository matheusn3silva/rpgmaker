from rest_framework import serializers
from authentication.models import User

class UserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['user', 'password', 'confirm_password']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError('As senhas nâo coicidem.')
        
        return data
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        return User.objects.create(**validated_data)