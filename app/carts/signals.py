from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Cart


@receiver(post_save, sender=Cart)
def handle_cart_status_change(sender, instance, created, **kwargs):
    """
    Handle cart status changes, especially when cart is finalized.
    """
    if not created:  # Only for updates, not new carts
        # Check if status changed to FINALIZADO
        if instance.status == 'FINALIZADO':
            # Here you would typically:
            # 1. Create an order in the orders app
            # 2. Send notifications
            # 3. Update inventory
            # 4. Generate invoice
            
            print(f"Cart {instance.id} has been finalized!")
            print(f"User: {instance.user.username}")
            print(f"Cart Type: {instance.cart_type}")
            
            # Calculate final totals
            totals = instance.get_total_payable()
            print(f"Subtotal: ${totals['subtotal']}")
            print(f"Total Payable: ${totals['total_payable']}")
            print(f"Discounts Applied: {len(totals['discounts_applied'])}")
            
            # For now, just print the information
            # In a real application, you would:
            # from orders.models import Order
            # Order.objects.create_from_cart(instance) 