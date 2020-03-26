import datetime

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
        user = self.model(auth_key=auth_key)
        user.save(self.db)
        return user


# Create your models here.
class VaultUser(AbstractBaseUser):
    auth_key = models.CharField(max_length=255, unique=True)
    objects = VaultUserManager()
    USERNAME_FIELD = 'auth_key'

    @property
    def token(self):
        return self._generate_jwt_token()

    def _generate_jwt_token(self):
        dt = datetime.now() + datetime.timedelta(days=60)
        token = jwt.encode({
            'id': self.pk,
            'exp': int(dt.strftime('%s'))
        }, settings.SECRET_KEY, algorithm='HS256')
        return token.decode('utf-8')

