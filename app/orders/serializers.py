from rest_framework import serializers
from .models import Order
from carts.serializers import CartSerializer

class OrderSerializer(serializers.ModelSerializer):
    cart = CartSerializer(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'cart', 'ordered_at', 'total_paid']
        read_only_fields = ['id', 'cart', 'ordered_at', 'total_paid'] 