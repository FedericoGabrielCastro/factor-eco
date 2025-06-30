from django.db import models
from carts.models import Cart

class Order(models.Model):
    """
    Order model linked to a finalized cart.
    """
    cart = models.OneToOneField(Cart, on_delete=models.CASCADE, related_name='order')
    ordered_at = models.DateTimeField(auto_now_add=True)
    total_paid = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        verbose_name = 'Order'
        verbose_name_plural = 'Orders'
        ordering = ['-ordered_at']

    def __str__(self):
        return f"Order {self.id} for Cart {self.cart.id} - ${self.total_paid}"
