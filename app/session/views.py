from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import login, logout
from drf_spectacular.utils import extend_schema, OpenApiExample
from .serializers import LoginSerializer, UserLoginResponseSerializer

# Create your views here.

@extend_schema(
    summary="Iniciar sesión",
    description="Autentica al usuario con username y password, devuelve información del usuario con estado VIP",
    request=LoginSerializer,
    responses={
        200: UserLoginResponseSerializer,
        400: OpenApiExample(
            'Error de autenticación',
            value={'error': 'Invalid username or password.'},
            response_only=True
        )
    },
    examples=[
        OpenApiExample(
            'Login exitoso',
            value={
                'message': 'Login successful',
                'user': {
                    'id': 1,
                    'username': 'usuario1',
                    'email': 'user1@test.com',
                    'profile': {
                        'is_vip': False,
                        'vip_since': None,
                        'vip_until': None,
                        'is_vip_active': False
                    }
                }
            },
            response_only=True
        )
    ],
    tags=['session']
)
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Handle user login with username and password.
    Returns user data including VIP status.
    """
    serializer = LoginSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.validated_data['user']
        login(request, user)
        
        # Serialize user data with profile information
        user_data = UserLoginResponseSerializer(user).data
        
        return Response({
            'message': 'Login successful',
            'user': user_data
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    summary="Cerrar sesión",
    description="Cierra la sesión del usuario autenticado",
    responses={
        200: OpenApiExample(
            'Logout exitoso',
            value={'message': 'Logout successful'},
            response_only=True
        )
    },
    tags=['session']
)
@api_view(['POST'])
def logout_view(request):
    """
    Handle user logout and delete sessionid and csrftoken cookies.
    """
    logout(request)
    response = Response({
        'message': 'Logout successful'
    }, status=status.HTTP_200_OK)
    # Delete sessionid and csrftoken cookies
    response.delete_cookie('sessionid')
    response.delete_cookie('csrftoken')
    return response


@extend_schema(
    summary="Usuario actual",
    description="Obtiene información del usuario autenticado actualmente",
    responses={
        200: UserLoginResponseSerializer,
        401: OpenApiExample(
            'No autenticado',
            value={'error': 'User not authenticated'},
            response_only=True
        )
    },
    tags=['session']
)
@api_view(['GET'])
def current_user_view(request):
    """
    Get current authenticated user data including VIP status.
    """
    if request.user.is_authenticated:
        user_data = UserLoginResponseSerializer(request.user).data
        return Response({
            'user': user_data
        }, status=status.HTTP_200_OK)
    
    return Response({
        'error': 'User not authenticated'
    }, status=status.HTTP_401_UNAUTHORIZED)
