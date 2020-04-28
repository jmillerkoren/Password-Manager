from django.urls import path
from django.urls import include, path
from pwmanager import views
from rest_framework import routers

router = routers.SimpleRouter()
router.register('users', views.UserViewSet, basename='users')
router.register('register', views.RegistrationViewSet, basename='register')
router.register('login', views.LoginViewSet, basename='login')
router.register('vault', views.VaultViewSet, basename='vault')

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]