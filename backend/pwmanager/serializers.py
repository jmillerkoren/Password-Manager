from .models import VaultUser, Vault
from rest_framework import serializers
from django.contrib.auth import authenticate


class VaultUserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = VaultUser
        fields = ['auth_key']


class RegistrationSerializer(serializers.HyperlinkedModelSerializer):
    token = serializers.CharField(max_length=255, read_only=True)
    auth_key = serializers.CharField(max_length=255)

    class Meta:
        model = VaultUser
        fields = ['auth_key', 'token']

    def create(self, validated_data):
        print(VaultUser.objects)
        return VaultUser.objects.create_user(**validated_data)


class LoginSerializer(serializers.HyperlinkedModelSerializer):
    token = serializers.CharField(max_length=255, read_only=True)
    auth_key = serializers.CharField(max_length=255)

    class Meta:
        model = VaultUser
        fields = ['auth_key', 'token']

    def validate(self, data):
        auth_key = data.get('auth_key', None)
        if auth_key is None:
            raise serializers.ValidationError('Auth token is required to login')
        user = authenticate(auth_key=auth_key)

        if user is None:
            raise serializers.ValidationError('A user with provided credentials does not exist')

        return {'token': user.token}


class VaultSerializer(serializers.HyperlinkedModelSerializer):
    vault_user = serializers.UUIDField(format='hex_verbose')
    username = serializers.CharField(max_length=255)
    password = serializers.CharField(max_length=255)
    domain = serializers.CharField(max_length=255)

    class Meta:
        model = Vault
        fields = ['vault_user', 'username', 'password', 'domain']

    def validate(self, data):
        user_id = data.get('vault_user', None)
        if user_id is None:
            raise serializers.ValidationError('Access token needed to access Vault')

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
            'vault_user': user_id,
            username: username,
            password: password,
            domain: domain
        }



