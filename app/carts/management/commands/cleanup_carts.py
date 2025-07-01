from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from carts.models import Cart


class Command(BaseCommand):
    """
    Clean up inactive carts from previous days.
    """
    help = 'Delete carts with ACTIVE status created before today'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be deleted without actually deleting',
        )

    def handle(self, *args, **options):
        """Execute the command."""
        # --- Eliminar carritos activos duplicados por usuario y tipo ---
        duplicates = 0
        for user_id, cart_type in Cart.objects.filter(status='ACTIVO').values_list('user_id', 'cart_type').distinct():
            carts = Cart.objects.filter(user_id=user_id, cart_type=cart_type, status='ACTIVO').order_by('-created_at')
            if carts.count() > 1:
                to_delete = list(carts[1:])
                duplicates += len(to_delete)
                Cart.objects.filter(id__in=[c.id for c in to_delete]).delete()
        if duplicates > 0:
            self.stdout.write(self.style.SUCCESS(f'Deleted {duplicates} duplicate ACTIVE carts (kept only the most recent per user and type).'))
        else:
            self.stdout.write(self.style.SUCCESS('No duplicate ACTIVE carts found.'))

        # --- Limpieza original de carritos inactivos antiguos ---
        yesterday = timezone.now().date() - timedelta(days=1)
        inactive_carts = Cart.objects.filter(
            status='ACTIVO',
            created_at__date__lt=yesterday
        )
        count = inactive_carts.count()
        if options['dry_run']:
            self.stdout.write(
                self.style.WARNING(
                    f'DRY RUN: Would delete {count} inactive carts from before {yesterday}'
                )
            )
            for cart in inactive_carts[:5]:  # Show first 5 as examples
                self.stdout.write(f'  - Cart {cart.id}: {cart.user.username} ({cart.created_at.date()})')
            if count > 5:
                self.stdout.write(f'  ... and {count - 5} more')
        else:
            if count > 0:
                inactive_carts.delete()
                self.stdout.write(
                    self.style.SUCCESS(
                        f'Successfully deleted {count} inactive carts from before {yesterday}'
                    )
                )
            else:
                self.stdout.write(
                    self.style.SUCCESS(
                        f'No inactive carts found from before {yesterday}'
                    )
                ) 