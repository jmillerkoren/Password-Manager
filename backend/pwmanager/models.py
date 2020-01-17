from django.contrib.auth.base_user import AbstractBaseUser
from django.db import models
from pwmanager.vault_user_manager import VaultUserManager

# Create your models here.


class VaultUser(AbstractBaseUser):
    auth_key = models.CharField(max_length=255, unique=True)

    objects = VaultUserManager()

    USERNAME_FIELD = 'auth_key'
    REQUIRED_FIELDS = []
