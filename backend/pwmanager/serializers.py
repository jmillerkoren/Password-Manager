import uuid
from .models import VaultUser, Vault
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password


class VaultUserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = VaultUser
        fields = ['auth_key']


class RegistrationSerializer(serializers.HyperlinkedModelSerializer):
    token = serializers.CharField(max_length=255, read_only=True)
    auth_key = serializers.CharField(max_length=255)
    email = serializers.CharField(max_length=255)

    class Meta:
        model = VaultUser
        fields = ['auth_key', 'token', 'email']

    def create(self, validated_data):
        return VaultUser.objects.create_user(**validated_data)


class LoginSerializer(serializers.HyperlinkedModelSerializer):
    token = serializers.CharField(max_length=255, read_only=True)
    auth_key = serializers.CharField(max_length=255)
    email = serializers.CharField(max_length=255)

    class Meta:
        model = VaultUser
        fields = ['auth_key', 'token', 'email']

    def validate(self, data):
        auth_key = data.get('auth_key', None)
        email = data.get('email', None)
        if auth_key is None:
            raise serializers.ValidationError('Auth token is required to login')
        user = authenticate(email, auth_key=auth_key, email=email)

        if user is None:
            raise serializers.ValidationError('A user with provided credentials does not exist')

        return {'token': user.token}


class VaultSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.UUIDField(required=False)
    username = serializers.CharField(max_length=255)
    password = serializers.CharField(max_length=255)
    domain = serializers.CharField(max_length=255)

    class Meta:
        model = Vault
        fields = ['username', 'password', 'domain', 'id']

    def validate(self, data):
        username = data.get('username', None)
        if username is None:
            raise serializers.ValidationError('Username must be provided')

        password = data.get('password', None)
        if password is None:
            raise serializers.ValidationError('Password must be  provided')

        domain = data.get('domain', None)
        if domain is None:
            raise serializers.ValidationError('Domain must be provided')

        return {
            'username': username,
            'password': password,
            'domain': domain
        }

    def create(self, validated_data):
        user = VaultUser.objects.get(pk=self.context.get('user_id'))
        if user is not None:
            vault_item = Vault(id=uuid.uuid4(), domain=validated_data['domain'], username=validated_data['username'],
                               password=validated_data['password'], vault_user=user)
            vault_item.save()
            return vault_item
