from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import datetime
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from .models import UserProfile
from .serializers import UserSerializer, UserProfileSerializer

# Create your views here.

@extend_schema_view(
    list=extend_schema(
        summary="Listar usuarios",
        description="Obtiene la lista de usuarios con opción de filtrar por estado VIP",
        parameters=[
            OpenApiParameter(
                name='vip',
                type=OpenApiTypes.BOOL,
                location=OpenApiParameter.QUERY,
                description='Filtrar por estado VIP (true/false)',
                required=False
            )
        ],
        tags=['users']
    ),
    vip_changes=extend_schema(
        summary="Cambios de estado VIP por mes",
        description="Obtiene usuarios que cambiaron su estado VIP en un mes específico",
        parameters=[
            OpenApiParameter(
                name='month',
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                description='Mes (1-12)',
                required=True
            ),
            OpenApiParameter(
                name='year',
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                description='Año',
                required=True
            )
        ],
        tags=['users']
    )
)
class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for listing users with VIP status filtering.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        """
        Filter users based on VIP status if specified.
        """
        queryset = User.objects.all()
        vip_status = self.request.query_params.get('vip', None)
        
        if vip_status is not None:
            vip_bool = vip_status.lower() == 'true'
            if vip_bool:
                queryset = queryset.filter(profile__is_vip=True)
            else:
                queryset = queryset.filter(profile__is_vip=False)
        
        return queryset

    @action(detail=False, methods=['get'])
    def vip_changes(self, request):
        """
        Get users who changed VIP status in a specific month.
        """
        month = request.query_params.get('month', None)
        year = request.query_params.get('year', None)
        
        if not month or not year:
            return Response(
                {'error': 'Both month and year parameters are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            month = int(month)
            year = int(year)
            start_date = timezone.make_aware(datetime(year, month, 1))
            if month == 12:
                end_date = timezone.make_aware(datetime(year + 1, 1, 1))
            else:
                end_date = timezone.make_aware(datetime(year, month + 1, 1))
        except ValueError:
            return Response(
                {'error': 'Invalid month or year format'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Users who became VIP in the specified month
        became_vip = User.objects.filter(
            profile__vip_since__gte=start_date,
            profile__vip_since__lt=end_date
        )
        
        # Users who lost VIP status in the specified month
        lost_vip = User.objects.filter(
            profile__vip_until__gte=start_date,
            profile__vip_until__lt=end_date
        )
        
        became_vip_data = UserSerializer(became_vip, many=True).data
        lost_vip_data = UserSerializer(lost_vip, many=True).data
        
        return Response({
            'became_vip': became_vip_data,
            'lost_vip': lost_vip_data,
            'month': month,
            'year': year
        })

    @action(detail=False, methods=['get'])
    def vip_status(self, request):
        """Return VIP status for the authenticated user."""
        if not request.user.is_authenticated:
            return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        return Response({
            'is_vip': profile.is_vip,
            'vip_since': profile.vip_since,
            'vip_until': profile.vip_until,
            'is_vip_active': profile.is_vip_active,
        })
