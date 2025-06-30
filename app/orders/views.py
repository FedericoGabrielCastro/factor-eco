from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db import transaction
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiExample, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from .models import Order
from carts.models import Cart
from .serializers import OrderSerializer
from users.models import UserProfile

# Create your views here.

@extend_schema(
    summary="Crear pedido",
    description="Finaliza un carrito y crea un pedido. Actualiza automáticamente el estado VIP del usuario si corresponde.",
    request=OpenApiExample(
        'Finalizar carrito',
        value={'cart_id': 1},
        request_only=True
    ),
    responses={
        201: OrderSerializer,
        400: OpenApiExample(
            'Carrito no válido',
            value={'error': 'Cart is not active or already finalized.'},
            response_only=True
        ),
        404: OpenApiExample(
            'Carrito no encontrado',
            value={'detail': 'Not found.'},
            response_only=True
        )
    },
    examples=[
        OpenApiExample(
            'Pedido creado exitosamente',
            value={
                'id': 1,
                'cart': {
                    'id': 1,
                    'cart_type': 'VIP',
                    'status': 'FINALIZADO',
                    'total_payable': 3499.98
                },
                'ordered_at': '2025-06-30T20:32:08.135598Z',
                'total_paid': '3499.98'
            },
            response_only=True
        )
    ],
    tags=['orders']
)
class OrderCreateView(generics.CreateAPIView):
    """
    Create an order from a cart.
    """
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        cart_id = request.data.get('cart_id')
        cart = get_object_or_404(Cart, id=cart_id, user=request.user)
        if cart.status != 'ACTIVO':
            return Response({'error': 'Cart is not active or already finalized.'}, status=status.HTTP_400_BAD_REQUEST)
        # Calculate total payable
        totals = cart.get_total_payable()
        total_paid = totals['total_payable']
        # Create order
        order = Order.objects.create(cart=cart, total_paid=total_paid)
        # Mark cart as finalized
        cart.status = 'FINALIZADO'
        cart.save()
        # Actualizar VIP
        self.update_vip_status(cart.user, total_paid)
        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update_vip_status(self, user, amount):
        """
        Update VIP status if user exceeds $10,000 in the current month.
        """
        profile, _ = UserProfile.objects.get_or_create(user=user)
        now = timezone.now()
        month_orders = Order.objects.filter(
            cart__user=user,
            ordered_at__year=now.year,
            ordered_at__month=now.month
        )
        total_month = sum(order.total_paid for order in month_orders)
        if total_month >= 10000 and not profile.is_vip:
            profile.is_vip = True
            profile.vip_since = now
            profile.save()

@extend_schema(
    summary="Listar pedidos",
    description="Obtiene la lista de pedidos con filtros opcionales por usuario, tipo de carrito y fechas",
    parameters=[
        OpenApiParameter(
            name='user',
            type=OpenApiTypes.BOOL,
            location=OpenApiParameter.QUERY,
            description='Filtrar por usuario actual (true/false)',
            required=False
        ),
        OpenApiParameter(
            name='cart_type',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            description='Filtrar por tipo de carrito (COMUN, FECHA_ESPECIAL, VIP)',
            required=False
        ),
        OpenApiParameter(
            name='start',
            type=OpenApiTypes.DATE,
            location=OpenApiParameter.QUERY,
            description='Fecha de inicio (YYYY-MM-DD)',
            required=False
        ),
        OpenApiParameter(
            name='end',
            type=OpenApiTypes.DATE,
            location=OpenApiParameter.QUERY,
            description='Fecha de fin (YYYY-MM-DD)',
            required=False
        )
    ],
    tags=['orders']
)
class OrderListView(generics.ListAPIView):
    """
    List all orders with optional filters.
    """
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Order.objects.all()
        user = self.request.user
        # Filtro por usuario
        if self.request.query_params.get('user', None):
            queryset = queryset.filter(cart__user=user)
        # Filtro por tipo de carrito
        cart_type = self.request.query_params.get('cart_type', None)
        if cart_type:
            queryset = queryset.filter(cart__cart_type=cart_type)
        # Filtro por rango de fechas
        start = self.request.query_params.get('start', None)
        end = self.request.query_params.get('end', None)
        if start:
            queryset = queryset.filter(ordered_at__date__gte=start)
        if end:
            queryset = queryset.filter(ordered_at__date__lte=end)
        return queryset.order_by('-ordered_at')
