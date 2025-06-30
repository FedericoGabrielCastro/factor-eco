from django.core.management.base import BaseCommand
from django.db import transaction
from products.models import Product
import random


class Command(BaseCommand):
    help = 'Ensures there are at least 15 base products in the database'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force recreation of all base products',
        )

    def handle(self, *args, **options):
        self.stdout.write('Checking base products...')
        
        # Base products data
        base_products = [
            {
                'name': 'Eco-Friendly Water Bottle',
                'description': 'Reusable stainless steel water bottle, perfect for reducing plastic waste. 500ml capacity with thermal insulation.',
                'price': 29.99,
                'stock': 50
            },
            {
                'name': 'Bamboo Toothbrush Set',
                'description': 'Pack of 4 biodegradable bamboo toothbrushes with soft bristles. Eco-friendly alternative to plastic toothbrushes.',
                'price': 12.99,
                'stock': 100
            },
            {
                'name': 'Organic Cotton Tote Bag',
                'description': 'Large reusable shopping bag made from 100% organic cotton. Perfect for groceries and daily use.',
                'price': 15.50,
                'stock': 75
            },
            {
                'name': 'Solar Power Bank',
                'description': '10000mAh portable charger with solar panel. Charge your devices using renewable energy.',
                'price': 45.99,
                'stock': 30
            },
            {
                'name': 'Beeswax Food Wraps',
                'description': 'Set of 3 reusable food wraps made from organic cotton and beeswax. Alternative to plastic wrap.',
                'price': 18.75,
                'stock': 60
            },
            {
                'name': 'LED Energy Saving Bulb Pack',
                'description': 'Pack of 4 LED bulbs, 9W equivalent to 60W incandescent. Save energy and money.',
                'price': 22.99,
                'stock': 80
            },
            {
                'name': 'Compostable Phone Case',
                'description': 'Biodegradable phone case made from plant-based materials. Fits iPhone and Samsung models.',
                'price': 19.99,
                'stock': 45
            },
            {
                'name': 'Hemp Face Mask',
                'description': 'Reusable face mask made from organic hemp fabric. Washable and breathable.',
                'price': 8.99,
                'stock': 120
            },
            {
                'name': 'Bamboo Cutlery Set',
                'description': 'Travel-friendly bamboo cutlery set with carrying case. Say no to disposable plastic utensils.',
                'price': 14.50,
                'stock': 90
            },
            {
                'name': 'Recycled Paper Notebook',
                'description': 'A5 notebook made from 100% recycled paper. 100 pages, perfect for notes and sketches.',
                'price': 6.99,
                'stock': 150
            },
            {
                'name': 'Organic Soap Bar',
                'description': 'Natural soap bar made from organic ingredients. No plastic packaging, gentle on skin.',
                'price': 4.99,
                'stock': 200
            },
            {
                'name': 'Stainless Steel Straw Set',
                'description': 'Set of 4 reusable stainless steel straws with cleaning brush. Reduce single-use plastic.',
                'price': 11.99,
                'stock': 70
            },
            {
                'name': 'Bamboo Coffee Cup',
                'description': 'Insulated coffee cup made from bamboo fiber. Keep your drinks hot or cold for hours.',
                'price': 24.99,
                'stock': 40
            },
            {
                'name': 'Organic Cotton Socks',
                'description': 'Pack of 3 pairs of socks made from 100% organic cotton. Comfortable and sustainable.',
                'price': 16.99,
                'stock': 85
            },
            {
                'name': 'Solar Garden Lights',
                'description': 'Set of 6 solar-powered garden lights. Automatic on/off, no electricity needed.',
                'price': 34.99,
                'stock': 35
            },
            {
                'name': 'Bamboo Hair Brush',
                'description': 'Natural bamboo hair brush with boar bristles. Gentle on hair and scalp.',
                'price': 13.50,
                'stock': 55
            },
            {
                'name': 'Recycled Glass Vase',
                'description': 'Beautiful vase made from 100% recycled glass. Perfect for flowers or decoration.',
                'price': 28.99,
                'stock': 25
            },
            {
                'name': 'Organic Tea Set',
                'description': 'Ceramic tea set made from natural materials. Includes teapot and 4 cups.',
                'price': 39.99,
                'stock': 20
            },
            {
                'name': 'Bamboo Phone Stand',
                'description': 'Adjustable phone stand made from sustainable bamboo. Perfect for video calls.',
                'price': 9.99,
                'stock': 95
            },
            {
                'name': 'Eco-Friendly Laundry Detergent',
                'description': 'Plant-based laundry detergent in biodegradable packaging. Gentle on clothes and environment.',
                'price': 17.99,
                'stock': 65
            }
        ]

        with transaction.atomic():
            if options['force']:
                # Delete all existing products and recreate
                Product.objects.all().delete()
                self.stdout.write('All existing products deleted.')
                created_count = 0
                products_to_create = 15  # Force create exactly 15 products
            else:
                # Check how many products exist
                existing_count = Product.objects.count()
                self.stdout.write(f'Found {existing_count} existing products.')
                
                if existing_count >= 15:
                    self.stdout.write(
                        self.style.SUCCESS('Already have at least 15 products. No action needed.')
                    )
                    return
                
                created_count = 0
                products_to_create = max(15 - existing_count, 0)

            # Create products
            for i in range(products_to_create):
                product_data = base_products[i % len(base_products)]
                
                # Add some randomization to make products unique
                if i >= len(base_products):
                    product_data = product_data.copy()
                    product_data['name'] = f"{product_data['name']} #{i + 1}"
                    product_data['price'] = round(product_data['price'] * (0.8 + random.random() * 0.4), 2)
                    product_data['stock'] = random.randint(10, 100)
                
                Product.objects.create(**product_data)
                created_count += 1

        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {created_count} new products.')
        )
        self.stdout.write(f'Total products in database: {Product.objects.count()}') 