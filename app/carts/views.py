from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db import transaction
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiExample
from .models import Cart, CartItem
from .serializers import CartSerializer, CartCreateSerializer, CartItemSerializer
from products.models import Product


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
class CartCreateView(generics.CreateAPIView):
    """
    Create a new cart.
    """
    serializer_class = CartCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        """Create cart with current user."""
        serializer.save(user=self.request.user)


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
        """Get cart or return 404."""
        return get_object_or_404(Cart, id=self.kwargs['cart_id'], user=self.request.user)

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
