from django.contrib.auth.backends import BaseBackend
from django.conf import settings
from .models import VaultUser
from rest_framework import exceptions, authentication
import jwt


class VaultBackend(BaseBackend):
    def authenticate(self, request, auth_key=None):
        try:
            vault_user = VaultUser.objects.get(auth_key=auth_key)
        except VaultUser.DoesNotExist:
            raise exceptions.AuthenticationFailed("No such user")
        return vault_user

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

        # the auth header of the request is 'byte' type and the jwt library used cannot
        # handle this so the content must be manually decoded to utf-8
        #decoded_token = access_token.decode('utf-8')

        return self._authenticate_credentials(request, access_token)

    def _authenticate_credentials(self, request, token):
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms='HS-256')
        except:
            msg = 'Could not decode token.'
            raise exceptions.AuthenticationFailed(msg)

        try:
            user = VaultUser.objects.get(pk=payload['id'])
        except VaultUser.DoesNotExist:
            msg = 'No user matching this token was found'
            raise exceptions.AuthenticationFailed(msg)

        return user, token





