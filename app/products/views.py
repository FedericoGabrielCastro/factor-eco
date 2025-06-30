from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiExample
from .models import Product
from .serializers import ProductSerializer
from .signals import create_base_products_manual

# Create your views here.

@extend_schema_view(
    list=extend_schema(
        summary="Listar productos",
        description="Obtiene la lista completa de productos disponibles en el catálogo",
        tags=['products']
    ),
    retrieve=extend_schema(
        summary="Obtener producto",
        description="Obtiene los detalles de un producto específico por su ID",
        tags=['products']
    )
)
class ProductListView(generics.ListAPIView):
    """
    List all products.
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]


class ProductDetailView(generics.RetrieveAPIView):
    """
    Retrieve a specific product by ID.
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]


@extend_schema(
    summary="Verificar productos base",
    description="Verifica si hay al menos 15 productos base y los crea si es necesario",
    responses={
        200: OpenApiExample(
            'Productos verificados',
            value={
                'message': 'Base products checked successfully',
                'total_products': 15,
                'products_created': 5,
                'status': 'success'
            },
            response_only=True
        )
    },
    tags=['products']
)
@api_view(['POST'])
@permission_classes([AllowAny])
def ensure_base_products_view(request):
    """
    Ensure there are at least 15 base products in the database.
    """
    try:
        # Get current product count
        current_count = Product.objects.count()
        
        # Create base products if needed
        result = create_base_products_manual()
        
        # Get new count
        new_count = Product.objects.count()
        products_created = new_count - current_count
        
        return Response({
            'message': 'Base products checked successfully',
            'total_products': new_count,
            'products_created': products_created,
            'status': 'success',
            'details': result
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'message': 'Error checking base products',
            'error': str(e),
            'status': 'error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
