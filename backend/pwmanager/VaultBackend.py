from django.contrib.auth.backends import BaseBackend
from .models import VaultUser
from rest_framework import exceptions


class VaultBackend(BaseBackend):
    def authenticate(self, request, auth_key=None):
        try:
            vault_user = VaultUser.objects.get(auth_key=auth_key)
        except VaultUser.DoesNotExist:
            raise exceptions.AuthenticationFailed("No such user")

        return vault_user, None
