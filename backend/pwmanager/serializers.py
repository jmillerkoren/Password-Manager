from .models import VaultUser
from rest_framework import serializers


class VaultUserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = VaultUser
        fields = ['auth_key']


class RegistrationSerializer(serializers.HyperlinkedModelSerializer):
    token = serializers.CharField(max_length=255, read_only=True)

    class Meta:
        model = VaultUser
        fields = ['auth_key', 'token']

    def create(self, validated_data):
        return VaultUser.objects.create(**validated_data)


class LoginSerializer(serializers.HyperlinkedModelSerializer):
    token = serializers.CharField(max_length=255)


