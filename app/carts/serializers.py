from rest_framework import serializers
from .models import Cart, CartItem
from products.serializers import ProductSerializer


class CartItemSerializer(serializers.ModelSerializer):
    """
    Serializer for CartItem model.
    """
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = CartItem
        fields = [
            'id',
            'product',
            'product_id',
            'quantity',
            'unit_price',
            'total_price',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'unit_price', 'created_at', 'updated_at']


class CartSerializer(serializers.ModelSerializer):
    """
    Serializer for Cart model with items and calculated totals.
    """
    items = CartItemSerializer(many=True, read_only=True)
    subtotal = serializers.ReadOnlyField()
    total_payable = serializers.ReadOnlyField()
    discounts_applied = serializers.ReadOnlyField()
    total_quantity = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = [
            'id',
            'user',
            'cart_type',
            'status',
            'items',
            'subtotal',
            'total_payable',
            'discounts_applied',
            'total_quantity',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def get_subtotal(self, obj):
        """Get subtotal from cart model."""
        return obj.get_subtotal()

    def get_total_payable(self, obj):
        """Get total payable with discounts from cart model."""
        return obj.get_total_payable()

    def to_representation(self, instance):
        """Override to include calculated fields."""
        data = super().to_representation(instance)
        simulated_date = self.context.get('simulated_date', None)
        totals = instance.get_total_payable(simulated_date=simulated_date)
        data['subtotal'] = totals['subtotal']
        data['total_payable'] = totals['total_payable']
        data['discounts_applied'] = totals['discounts_applied']
        data['total_quantity'] = totals['total_quantity']
        return data


class CartCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating new carts.
    """
    class Meta:
        model = Cart
        fields = ['cart_type']
        extra_kwargs = {
            'cart_type': {'required': True}
        } 