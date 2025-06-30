from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from .models import SpecialDatePromotion
from .serializers import SpecialDatePromotionSerializer
from .utils import get_effective_date

# Create your views here.

@extend_schema(
    summary="Promociones por fecha",
    description="Obtiene las promociones activas para una fecha específica. Permite simular fechas para pruebas.",
    parameters=[
        OpenApiParameter(
            name='fecha',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            description='Fecha en formato YYYY-MM-DD (opcional, usa fecha actual si no se especifica)',
            required=False
        )
    ],
    tags=['promotions']
)
class SpecialDatePromotionListView(generics.ListAPIView):
    """
    List active promotions for the effective date.
    """
    serializer_class = SpecialDatePromotionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        """
        Filter promotions that are active on the effective date.
        """
        effective_date = get_effective_date(self.request)
        return SpecialDatePromotion.objects.filter(
            start_date__lte=effective_date,
            end_date__gte=effective_date
        )

    def list(self, request, *args, **kwargs):
        """
        Override list method to include effective date in response.
        """
        response = super().list(request, *args, **kwargs)
        effective_date = get_effective_date(request)
        response.data = {
            'effective_date': effective_date.isoformat(),
            'promotions': response.data
        }
        return response
