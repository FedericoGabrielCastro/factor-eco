from django.shortcuts import render, get_object_or_404
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiExample
from rest_framework.exceptions import ValidationError
from .models import Cart, CartItem
from .serializers import CartSerializer, CartCreateSerializer, CartItemSerializer
from products.models import Product
from promotions.models import SpecialDatePromotion
from datetime import date


@extend_schema(
    summary="Crear carrito",
    description="Crea un nuevo carrito de compra para el usuario autenticado",
    request=CartCreateSerializer,
    responses={
        201: CartSerializer,
        400: OpenApiExample(
            'Error de validación',
            value={'cart_type': ['This field is required.']},
            response_only=True
        )
    },
    examples=[
        OpenApiExample(
            'Carrito VIP',
            value={'cart_type': 'VIP'},
            request_only=True
        ),
        OpenApiExample(
            'Carrito común',
            value={'cart_type': 'COMUN'},
            request_only=True
        )
    ],
    tags=['carts']
)
class CartListCreateView(generics.ListCreateAPIView):
    """
    List all carts for the authenticated user (GET), or create a new cart (POST).
    Soporta filtros por type, status y simulación de fecha.
    """
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CartCreateSerializer
        return CartSerializer

    def get_queryset(self):
        qs = Cart.objects.filter(user=self.request.user)
        cart_type = self.request.query_params.get('type')
        status = self.request.query_params.get('status')
        if cart_type:
            qs = qs.filter(cart_type=cart_type)
        if status:
            qs = qs.filter(status=status)
        return qs

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        if hasattr(self.request, 'simulated_date'):
            ctx['simulated_date'] = self.request.simulated_date
        return ctx

    def perform_create(self, serializer):
        user = self.request.user
        is_vip = hasattr(user, 'profile') and user.profile.is_vip
        simulated_date = getattr(self.request, 'simulated_date', None)
        effective_date = simulated_date or date.today()
        if is_vip:
            cart_type = 'VIP'
        else:
            promo = SpecialDatePromotion.objects.filter(
                start_date__lte=effective_date,
                end_date__gte=effective_date
            ).first()
            if promo:
                cart_type = 'FECHA_ESPECIAL'
            else:
                cart_type = 'COMUN'
        serializer.save(user=user, cart_type=cart_type)

    def create(self, request, *args, **kwargs):
        """Override to return full cart data after creation."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        cart = serializer.instance
        output_serializer = CartSerializer(cart, context=self.get_serializer_context())
        headers = self.get_success_headers(output_serializer.data)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED, headers=headers)


@extend_schema_view(
    retrieve=extend_schema(
        summary="Obtener carrito",
        description="Obtiene los detalles de un carrito específico con items y descuentos aplicados",
        tags=['carts']
    ),
    destroy=extend_schema(
        summary="Eliminar carrito",
        description="Elimina un carrito específico",
        tags=['carts']
    )
)
class CartDetailView(generics.RetrieveAPIView, generics.DestroyAPIView):
    """
    Retrieve or delete a specific cart.
    """
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter carts by current user."""
        return Cart.objects.filter(user=self.request.user)

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        if hasattr(self.request, 'simulated_date'):
            ctx['simulated_date'] = self.request.simulated_date
        return ctx


@extend_schema(
    summary="Agregar item al carrito",
    description="Agrega un producto al carrito. Si el producto ya existe, suma la cantidad.",
    request=CartItemSerializer,
    responses={
        201: CartItemSerializer,
        400: OpenApiExample(
            'Error de validación',
            value={'product_id': ['This field is required.'], 'quantity': ['This field is required.']},
            response_only=True
        )
    },
    examples=[
        OpenApiExample(
            'Agregar producto',
            value={'product_id': 1, 'quantity': 2},
            request_only=True
        )
    ],
    tags=['carts']
)
class CartItemCreateView(generics.CreateAPIView):
    """
    Add item to cart.
    """
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_cart(self):
        """Get cart or create one if it does not exist, considering VIP status and special date promotions."""
        user = self.request.user
        cart_id = self.kwargs.get('cart_id')
        if cart_id:
            try:
                return Cart.objects.get(id=cart_id, user=user)
            except Cart.DoesNotExist:
                pass
        
        # Determine cart type based on VIP status and special date promotions
        is_vip = hasattr(user, 'profile') and user.profile.is_vip
        simulated_date = getattr(self.request, 'simulated_date', None)
        effective_date = simulated_date or date.today()
        
        if is_vip:
            cart_type = 'VIP'
        else:
            promo = SpecialDatePromotion.objects.filter(
                start_date__lte=effective_date,
                end_date__gte=effective_date
            ).first()
            if promo:
                cart_type = 'FECHA_ESPECIAL'
            else:
                cart_type = 'COMUN'
        
        # Look for existing active cart of the determined type
        cart = Cart.objects.filter(user=user, cart_type=cart_type, status='ACTIVO').first()
        if cart:
            return cart
        
        # If no existing cart, create a new one
        return Cart.objects.create(user=user, cart_type=cart_type)

    @transaction.atomic
    def perform_create(self, serializer):
        """Add item to cart, updating quantity if product already exists."""
        cart = self.get_cart()
        product_id = serializer.validated_data['product_id']
        quantity = serializer.validated_data['quantity']
        
        # Get product and current price
        product = get_object_or_404(Product, id=product_id)
        unit_price = product.price
        
        # Check if item already exists in cart
        existing_item = CartItem.objects.filter(cart=cart, product=product).first()
        
        if existing_item:
            # Update quantity of existing item
            existing_item.quantity += quantity
            existing_item.save()
            serializer.instance = existing_item
        else:
            # Create new item
            serializer.save(cart=cart, unit_price=unit_price)


@extend_schema_view(
    patch=extend_schema(
        summary="Actualizar item del carrito",
        description="Actualiza la cantidad de un item. Si quantity=0, elimina el item.",
        tags=['carts']
    ),
    delete=extend_schema(
        summary="Eliminar item del carrito",
        description="Elimina un item específico del carrito",
        tags=['carts']
    )
)
class CartItemUpdateView(generics.UpdateAPIView, generics.DestroyAPIView):
    """
    Update or delete a specific cart item.
    """
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter items by cart and user."""
        return CartItem.objects.filter(
            cart_id=self.kwargs['cart_id'],
            cart__user=self.request.user
        )

    def patch(self, request, *args, **kwargs):
        """Update item quantity or delete if quantity is 0."""
        item = self.get_object()
        quantity = request.data.get('quantity', item.quantity)
        
        if quantity == 0:
            # Delete item if quantity is 0
            item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            # Update quantity
            item.quantity = quantity
            item.save()
            serializer = self.get_serializer(item)
            return Response(serializer.data)
