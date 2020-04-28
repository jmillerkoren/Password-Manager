from datetime import datetime, timedelta
from .models import VaultUser
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import VaultUserSerializer, RegistrationSerializer, LoginSerializer, VaultSerializer
from pwmanager.backends import VaultBackend
from django.http import HttpResponse


class UserViewSet(viewsets.ModelViewSet):
    queryset = VaultUser.objects.all()
    serializer_class = VaultUserSerializer
    """
    A ViewSet for listing and retrieving users
    """
    @action(methods=['get'], detail=False)
    def all_users(self, request):
        users = self.get_queryset()
        serializer = self.get_serializer_class()(users, many=True)
        return Response(serializer.data)

    @action(methods=['post'], detail=False)
    def login(self, request):
        v = VaultBackend()
        v.authenticate(request, auth_key=request.data['auth_key'])
        return Response()


class RegistrationViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for registering users
    """
    serializer_class = RegistrationSerializer
    @action(methods=['post'], detail=False)
    def create_user(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.create(serializer.validated_data)
        response = HttpResponse()
        response.set_cookie('access_token', user.token, httponly=False, expires= datetime.now() + timedelta(days=60))
        return response


class LoginViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for logging users in
    """
    serializer_class = LoginSerializer
    @action(methods=['post'], detail=False)
    def login_user(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        response = HttpResponse()
        response.set_cookie('access_token', serializer.validated_data['token'], httponly=False, expires= datetime.now() + timedelta(days=60))
        return response


class VaultViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for adding and retrieving passwords to and from vault
    """
    serializer_class = VaultSerializer
    @action(methods=['get'], detail=False)
    def retrieve_vault(self, request):
        return None

    @action(methods=['post'], detail=False)
    def add_vault(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.validated_data)
