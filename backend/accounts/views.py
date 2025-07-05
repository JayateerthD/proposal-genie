from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.http import JsonResponse
from .serializers import UserRegistrationSerializer, UserSerializer


def check_server_health(request):
    """Health check endpoint"""
    return JsonResponse({'status': 'ok'}, status=status.HTTP_200_OK)


def get_tokens_for_user(user):
    """Generate JWT tokens for user"""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class UserRegistrationAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            serializer = UserRegistrationSerializer(data=request.data)

            if serializer.is_valid():
                # Create the user
                user = serializer.save()

                # Generate JWT tokens
                tokens = get_tokens_for_user(user)

                # Get user data for response
                user_data = UserSerializer(user).data

                return Response({
                    'success': True,
                    'message': 'Registration successful! Welcome to ProposalGenie.',
                    'data': {
                        'user': user_data,
                        'tokens': tokens
                    }
                }, status=status.HTTP_201_CREATED)

            else:
                return Response({
                    'success': False,
                    'message': 'Registration failed. Please check your input.',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                'success': False,
                'message': 'An error occurred during registration.',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserLoginAPIView(APIView):
    """User login endpoint"""
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({
                'error': 'Email and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(email=email, password=password)

        if user is not None and user.is_active:
            token = get_tokens_for_user(user=user)
            user_data = UserSerializer(user).data

            return Response({
                'token': token,
                'user': user_data,
                'message': "Login Successful"
            }, status=status.HTTP_200_OK)

        return Response({
            'error': 'Invalid credentials or inactive account'
        }, status=status.HTTP_401_UNAUTHORIZED)


class UserProfileAPIView(APIView):
    """Get user profile endpoint"""

    def get(self, request):
        user_data = UserSerializer(request.user).data
        return Response({
            'user': user_data
        }, status=status.HTTP_200_OK)
