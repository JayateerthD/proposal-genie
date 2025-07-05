from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.check_server_health, name='health'),
    path('login/', views.UserLoginAPIView.as_view(), name='login'),
    path('profile/', views.UserProfileAPIView.as_view(), name='profile'),
    path('register/', views.UserRegistrationAPIView.as_view(), name='register'),
]
