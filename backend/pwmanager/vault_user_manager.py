from django.contrib.auth.base_user import BaseUserManager


class VaultUserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, auth_key):
        """
        Creates and saves a Vault User with a given auth key.
        """
        if not auth_key:
            raise ValueError('Auth key must be set')
        user = self.model(auth_key=auth_key)
        user.save(using=self.db)
        return user

    def create_user(self, auth_key):
        return self._create_user(auth_key)
