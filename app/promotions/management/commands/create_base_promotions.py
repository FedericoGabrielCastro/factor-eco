from django.core.management.base import BaseCommand
from promotions.models import SpecialDatePromotion
from datetime import date

class Command(BaseCommand):
    help = 'Create base special date promotions for demo purposes.'

    def handle(self, *args, **options):
        # Delete all old promotions
        SpecialDatePromotion.objects.all().delete()
        promos = [
            {
                'description': 'Mega descuento 2025',
                'start_date': date(2025, 1, 1),
                'end_date': date(2025, 12, 31),
                'discount_amount': 300.00,
            },
            {
                'description': 'Año del programador 2024',
                'start_date': date(2024, 1, 1),
                'end_date': date(2024, 12, 31),
                'discount_amount': 300.00
            },
        ]
        for promo in promos:
            obj, created = SpecialDatePromotion.objects.get_or_create(
                description=promo['description'],
                start_date=promo['start_date'],
                end_date=promo['end_date'],
                defaults={
                    'discount_amount': promo.get('discount_amount', 0),
                }
            )
            # Update if already exists
            updated = False
            if 'discount_amount' in promo and obj.discount_amount != promo['discount_amount']:
                obj.discount_amount = promo['discount_amount']
                updated = True
            if updated:
                obj.save()
            self.stdout.write(self.style.SUCCESS(
                f"Promotion '{obj.description}' ({obj.start_date} - {obj.end_date}) [${obj.discount_amount}] {'created' if created else 'updated'}"
            )) 