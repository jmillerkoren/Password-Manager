from .models import VaultUser
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import VaultUserSerializer, RegistrationSerializer
from pwmanager.Backends import VaultBackend


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
        user = request.data.get('auth_key', {})
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class LoginViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for logging users in
    """
    serializer_class = LoginSerializer
