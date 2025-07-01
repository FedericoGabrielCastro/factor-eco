from django.db import models
from django.contrib.auth.models import User
from products.models import Product
from decimal import Decimal
from promotions.models import SpecialDatePromotion
from datetime import date


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
        constraints = [
            models.UniqueConstraint(fields=['user', 'cart_type', 'status'], name='unique_active_cart_per_user_type', condition=models.Q(status='ACTIVO'))
        ]

    def __str__(self):
        return f"Cart {self.id} - {self.user.username} ({self.cart_type})"

    def get_subtotal(self):
        """
        Calculate subtotal by summing unit_price × quantity for all items.
        """
        return sum(item.unit_price * item.quantity for item in self.items.all())

    def get_total_payable(self, simulated_date=None):
        """
        Calculate total payable with discounts applied in order:
        1. If total quantity is exactly 4 → 25% discount on subtotal
        2. If total quantity > 10 → -$100 additional
        3. If there is an active special date promotion → discount (discount_amount)
        4. If type == VIP → free one unit of the cheapest item + $500 discount
        5. Always add $1000 service fee (never less than $1000 total)
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
                'description': '25% de descuento por exactamente 4 productos',
                'amount': float(discount)
            })

        # Rule 2: If total quantity > 10 items are purchased → $100 discount
        if total_quantity > 10:
            final_total -= Decimal('100.00')
            discounts_applied.append({
                'type': 'quantity_over_10',
                'description': '$100 de descuento por más de 10 productos',
                'amount': 100.00
            })

        # Rule 3: If there is an active special date promotion → discount
        if self.cart_type != 'VIP':
            effective_date = simulated_date or date.today()
            promo = SpecialDatePromotion.objects.filter(
                start_date__lte=effective_date,
                end_date__gte=effective_date
            ).order_by('-discount_amount').first()
            if promo and promo.discount_amount > 0:
                final_total -= promo.discount_amount
                discounts_applied.append({
                    'type': 'special_date_promotion',
                    'description': f'Descuento por fecha especial: {promo.description}',
                    'amount': float(promo.discount_amount)
                })

        # Rule 4: If cart is VIP → free one unit of the cheapest item + $500 discount
        if self.cart_type == 'VIP':
            # Only apply free cheapest item if there is more than 1 product in total (any combination)
            if total_quantity > 1:
                cheapest_item = self.items.order_by('unit_price').first()
                if cheapest_item:
                    item_discount = cheapest_item.unit_price  # Only one unit
                    final_total -= item_discount
                    discounts_applied.append({
                        'type': 'vip_free_cheapest',
                        'description': f'1x gratis {cheapest_item.product.name}',
                        'amount': float(item_discount)
                    })
            # $500 VIP discount always applies
            final_total -= Decimal('500.00')
            discounts_applied.append({
                'type': 'vip_general',
                'description': '$500 de descuento VIP',
                'amount': 500.00
            })

        # Rule 5: Always add $1000 service fee
        service_fee = Decimal('1000.00')
        final_total += service_fee
        discounts_applied.append({
            'type': 'service_fee',
            'description': 'Cargo por servicio',
            'amount': float(service_fee)
        })

        # Ensure total doesn't go below service fee
        final_total = max(final_total, service_fee)

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
