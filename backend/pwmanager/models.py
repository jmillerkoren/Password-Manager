from django.contrib.auth.base_user import AbstractBaseUser
from django.db import models
from django.contrib.auth.base_user import BaseUserManager


class VaultUserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, auth_key, password):
        """
        Creates and saves a Vault User with a given auth key.
        """
        if not auth_key:
            raise ValueError('Auth key must be set')
        user = self.model(auth_key=auth_key)
        user.set_password(password)
        user.save(using=self.db)
        print(user)
        return user

    def create_user(self, auth_key, password):
        return self._create_user(auth_key, password)

# Create your models here.


class VaultUser(AbstractBaseUser):
    auth_key = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    objects = VaultUserManager()
    USERNAME_FIELD = 'auth_key'
