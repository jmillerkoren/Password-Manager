from datetime import datetime, timedelta
from .models import VaultUser, Vault
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import VaultUserSerializer, RegistrationSerializer, LoginSerializer, VaultSerializer
from pwmanager.backends import VaultBackend
from django.http import HttpResponse
from rest_framework import status


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
        response.set_cookie('access_token', user.token, httponly=False, expires=datetime.now() + timedelta(days=60), path='/')
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
        response = Response()
        response.set_cookie('access_token', serializer.validated_data['token'], httponly=False,
                            expires=datetime.now() + timedelta(days=60), path='/')
        return response

    @action(methods=['post'], detail=False)
    def login_user_extension(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        headers = {'Authorization': 'Bearer {}'.format(serializer.validated_data['token'])}
        response = Response(headers=headers)
        return response


class LogoutViewSet(viewsets.ModelViewSet):
    @action(methods=['post'], detail=False)
    def logout_user(self, request):
        response = HttpResponse()
        response.delete_cookie('access_token')
        return response


class VaultViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for adding and retrieving passwords to and from vault
    """
    serializer_class = VaultSerializer
    @action(methods=['get'], detail=False)
    def retrieve_vault(self, request):
        vault_items = Vault.objects.filter(vault_user=request.user)
        serializer = self.serializer_class(vault_items, many=True)
        return Response(serializer.data)

    @action(methods=['post'], detail=False)
    def add_vault(self, request):
        request.data['vault_user'] = str(request.user.id)
        serializer = self.serializer_class(data=request.data, context={'user_id': request.user.id})
        serializer.is_valid(raise_exception=True)
        vault_item = serializer.save()
        return Response(serializer.validated_data)

    @action(methods=['delete'], detail=False)
    def delete_vault(self,  request):
        item_id = request.query_params.get('id')
        item = Vault.objects.get(id=item_id)
        item.delete()
        return Response(status=status.HTTP_200_OK)

    @action(methods=['put'], detail=False)
    def edit_vault(self, request):
        item_id = request.query_params.get('id')
        item = Vault.objects.get(id=item_id)
        serializer = self.serializer_class(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.validated_data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

