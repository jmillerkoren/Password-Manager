from .models import VaultUser
from rest_framework import serializers


class VaultUserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = VaultUser
        fields = ['auth_key']
