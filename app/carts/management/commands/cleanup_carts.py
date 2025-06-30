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
        # Get yesterday's date
        yesterday = timezone.now().date() - timedelta(days=1)
        
        # Find inactive carts from previous days
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