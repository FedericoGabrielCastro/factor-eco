from django.db import models
from django.contrib.auth.models import User
from products.models import Product
from decimal import Decimal


class Cart(models.Model):
    """
    Cart model for managing shopping carts with different types and statuses.
    """
    CART_TYPES = [
        ('COMUN', 'Común'),
        ('FECHA_ESPECIAL', 'Fecha Especial'),
        ('VIP', 'VIP'),
    ]
    
    CART_STATUS = [
        ('ACTIVO', 'Activo'),
        ('FINALIZADO', 'Finalizado'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='carts')
    cart_type = models.CharField(max_length=20, choices=CART_TYPES, default='COMUN')
    status = models.CharField(max_length=20, choices=CART_STATUS, default='ACTIVO')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Cart'
        verbose_name_plural = 'Carts'
        ordering = ['-created_at']

    def __str__(self):
        return f"Cart {self.id} - {self.user.username} ({self.cart_type})"

    def get_subtotal(self):
        """
        Calculate subtotal by summing unit_price × quantity for all items.
        """
        return sum(item.unit_price * item.quantity for item in self.items.all())

    def get_total_payable(self):
        """
        Calculate total payable with discounts applied in order:
        1. If total quantity is exactly 4 → 25% discount on subtotal
        2. If total quantity > 10 → -$100 additional
        3. If type == FECHA_ESPECIAL → -$300 fixed
        4. If type == VIP → free cheapest item + -$500 general
        """
        subtotal = self.get_subtotal()
        total_quantity = sum(item.quantity for item in self.items.all())
        discounts_applied = []
        final_total = subtotal

        # Rule 1: Exactly 4 items → 25% discount
        if total_quantity == 4:
            discount = subtotal * Decimal('0.25')
            final_total -= discount
            discounts_applied.append({
                'type': 'quantity_exactly_4',
                'description': '25% discount for exactly 4 items',
                'amount': float(discount)
            })

        # Rule 2: More than 10 items → -$100
        if total_quantity > 10:
            final_total -= Decimal('100.00')
            discounts_applied.append({
                'type': 'quantity_over_10',
                'description': '$100 discount for more than 10 items',
                'amount': 100.00
            })

        # Rule 3: FECHA_ESPECIAL type → -$300
        if self.cart_type == 'FECHA_ESPECIAL':
            final_total -= Decimal('300.00')
            discounts_applied.append({
                'type': 'fecha_especial',
                'description': '$300 discount for special date',
                'amount': 300.00
            })

        # Rule 4: VIP type → free cheapest item + -$500
        if self.cart_type == 'VIP':
            # Find cheapest item and make it free
            cheapest_item = self.items.order_by('unit_price').first()
            if cheapest_item:
                item_discount = cheapest_item.unit_price * cheapest_item.quantity
                final_total -= item_discount
                discounts_applied.append({
                    'type': 'vip_free_cheapest',
                    'description': f'Free {cheapest_item.product.name}',
                    'amount': float(item_discount)
                })

            # Additional $500 discount
            final_total -= Decimal('500.00')
            discounts_applied.append({
                'type': 'vip_general',
                'description': '$500 VIP discount',
                'amount': 500.00
            })

        # Ensure total doesn't go below zero
        final_total = max(final_total, Decimal('0.00'))

        return {
            'subtotal': float(subtotal),
            'total_payable': float(final_total),
            'discounts_applied': discounts_applied,
            'total_quantity': total_quantity
        }


class CartItem(models.Model):
    """
    CartItem model for individual items in a cart.
    """
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Cart Item'
        verbose_name_plural = 'Cart Items'
        unique_together = ['cart', 'product']

    def __str__(self):
        return f"{self.quantity}x {self.product.name} in Cart {self.cart.id}"

    def get_total_price(self):
        """
        Calculate total price for this item (unit_price × quantity).
        """
        return self.unit_price * self.quantity
