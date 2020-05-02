from datetime import datetime, timedelta
import uuid
from django.contrib.auth.base_user import AbstractBaseUser
from django.db import models
from django.contrib.auth.base_user import BaseUserManager
import jwt

from backend import settings


class VaultUserManager(BaseUserManager):
    def create_user(self, auth_key):
        """
        Creates and saves a Vault User with a given auth key.
        """
        if not auth_key:
            raise ValueError('Auth key must be set')
        user = self.model(id=uuid.uuid4(), auth_key=auth_key)
        user.save(self.db)
        return user


# Create your models here.
class VaultUser(AbstractBaseUser):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4(), unique=True)
    auth_key = models.CharField(max_length=255)
    objects = VaultUserManager()
    USERNAME_FIELD = 'auth_key'

    @property
    def token(self):
        return self._generate_jwt_token()

    def _generate_jwt_token(self):
        dt = datetime.now() + timedelta(days=60)
        token = jwt.encode({
            'id': str(self.pk),
            'exp': dt
        }, settings.SECRET_KEY, algorithm='HS256')
        return token.decode('utf-8')


class Vault(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4(), unique=True)
    domain = models.CharField(max_length=255)
    username = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    vault_user = models.ForeignKey(VaultUser, on_delete=models.CASCADE)

