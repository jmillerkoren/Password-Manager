from django.contrib.auth.backends import BaseBackend
from django.conf import settings
from .models import VaultUser
from rest_framework import exceptions, authentication
import jwt
from django.contrib.auth.hashers import check_password


class VaultBackend(BaseBackend):
    def authenticate(self, request, email=None, auth_key=None):
        try:
            vault_user = VaultUser.objects.get(email=email)
        except VaultUser.DoesNotExist:
            raise exceptions.AuthenticationFailed("No such user")
        correct_credentials = check_password(auth_key, vault_user.auth_key)
        if correct_credentials:
            return vault_user
        raise exceptions.AuthenticationFailed("Provided credentials are not correct")

    def get_user(self, vault_key):
        try:
            print(vault_key)
            return VaultUser.objects.get(pk=vault_key), None
        except VaultBackend.DoesNotExist:
            return None


class TokenBackend(BaseBackend):
    def authenticate(self, request):
        access_token = request.COOKIES.get('access_token')

        if not access_token:
            return None

        return self._authenticate_credentials(request, access_token)

    def _authenticate_credentials(self, request, token):
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except:
            msg = 'Could not decode token.'
            raise exceptions.AuthenticationFailed(msg)

        try:
            user = VaultUser.objects.get(pk=payload['id'])
        except VaultUser.DoesNotExist:
            msg = 'No user matching this token was found'
            raise exceptions.AuthenticationFailed(msg)

        return user, token

class TokenBackendExtension(BaseBackend):
    def authenticate(self, request):
        access_token = request.META.get('HTTP_AUTHORIZATION')

        if not access_token:
            return None

        return self._authenticate_credentials(request, access_token)

    def _authenticate_credentials(self, request, token):
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except:
            msg = 'Could not decode token.'
            raise exceptions.AuthenticationFailed(msg)

        try:
            user = VaultUser.objects.get(pk=payload['id'])
        except VaultUser.DoesNotExist:
            msg = 'No user matching this token was found'
            raise exceptions.AuthenticationFailed(msg)

        return user, token








