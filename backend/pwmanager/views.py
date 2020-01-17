from django.shortcuts import render
from django.http import HttpResponse
from .models import VaultUser
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from pwmanager.serializers import VaultUserSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = VaultUser.objects.all()
    serializer_class = VaultUserSerializer
    """
    A ViewSet for listing, retrieving, creating and editing users.
    """
    @action(methods=['get'], detail=False)
    def all_users(self, request):
        users = self.get_queryset()
        serializer = self.get_serializer_class()(users, many=True)
        return Response(serializer.data)

    @action(methods=['post'], detail=False)
    def create_user(self, request):
        user = VaultUser.objects.create_user(request.data['auth_key'])
        user_serializer = self.get_serializer_class()(user, context={'request': request})
        return Response(user_serializer.data)


    @action(methods=['post'], detail=False)
    def login(self, request):
        return Response()

