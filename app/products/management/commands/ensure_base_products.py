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
        # Delete all old products
        Product.objects.all().delete()
        self.stdout.write('All existing products deleted.')
        
        # Base products data
        base_products = [
            {
                'name': 'Botella de Agua Ecológica',
                'description': 'Botella reutilizable de acero inoxidable, ideal para reducir el uso de plásticos. Capacidad de 500ml con aislamiento térmico.',
                'price': 3501.00,
                'stock': 50
            },
            {
                'name': 'Set de Cepillos de Bambú',
                'description': 'Pack de 4 cepillos de dientes biodegradables de bambú con cerdas suaves. Alternativa ecológica a los cepillos plásticos.',
                'price': 3590.00,
                'stock': 100
            },
            {
                'name': 'Bolsa Tote de Algodón Orgánico',
                'description': 'Bolsa de compras reutilizable, grande, hecha 100% de algodón orgánico. Perfecta para compras y uso diario.',
                'price': 3700.00,
                'stock': 75
            },
            {
                'name': 'Cargador Solar Portátil',
                'description': 'Power bank de 10000mAh con panel solar. Carga tus dispositivos usando energía renovable.',
                'price': 3999.99,
                'stock': 30
            },
            {
                'name': 'Envoltorios de Cera de Abeja',
                'description': 'Set de 3 envoltorios reutilizables hechos de algodón orgánico y cera de abeja. Alternativa al film plástico.',
                'price': 3550.00,
                'stock': 60
            },
            {
                'name': 'Pack de Lámparas LED Bajo Consumo',
                'description': 'Pack de 4 lámparas LED, 9W equivalentes a 60W incandescentes. Ahorra energía y dinero.',
                'price': 3600.00,
                'stock': 80
            },
            {
                'name': 'Funda de Teléfono Compostable',
                'description': 'Funda biodegradable hecha de materiales vegetales. Compatible con modelos iPhone y Samsung.',
                'price': 3750.00,
                'stock': 45
            },
            {
                'name': 'Barbijo de Tela de Cáñamo',
                'description': 'Barbijo reutilizable hecho de tela de cáñamo orgánico. Lavable y respirable.',
                'price': 3520.00,
                'stock': 120
            },
            {
                'name': 'Set de Cubiertos de Bambú',
                'description': 'Set de cubiertos de bambú con estuche para llevar. Di no a los utensilios plásticos descartables.',
                'price': 3800.00,
                'stock': 90
            },
            {
                'name': 'Cuaderno de Papel Reciclado',
                'description': 'Cuaderno A5 hecho 100% de papel reciclado. 100 hojas, ideal para notas y bocetos.',
                'price': 3555.00,
                'stock': 150
            },
            {
                'name': 'Jabón Orgánico en Barra',
                'description': 'Jabón natural elaborado con ingredientes orgánicos. Sin envase plástico, suave para la piel.',
                'price': 3600.00,
                'stock': 200
            },
            {
                'name': 'Set de Sorbetes de Acero Inoxidable',
                'description': 'Set de 4 sorbetes reutilizables de acero inoxidable con cepillo de limpieza. Reduce el plástico de un solo uso.',
                'price': 3700.00,
                'stock': 70
            },
            {
                'name': 'Vaso de Café de Bambú',
                'description': 'Vaso térmico hecho de fibra de bambú. Mantiene tus bebidas calientes o frías por horas.',
                'price': 3900.00,
                'stock': 40
            },
            {
                'name': 'Pack de Medias de Algodón Orgánico',
                'description': 'Pack de 3 pares de medias hechas 100% de algodón orgánico. Cómodas y sustentables.',
                'price': 3550.00,
                'stock': 85
            },
            {
                'name': 'Luces Solares para Jardín',
                'description': 'Set de 6 luces solares para jardín. Encendido/apagado automático, sin necesidad de electricidad.',
                'price': 4000.00,
                'stock': 35
            },
            {
                'name': 'Cepillo de Pelo de Bambú',
                'description': 'Cepillo natural de bambú con cerdas de jabalí. Suave con el cabello y el cuero cabelludo.',
                'price': 3600.00,
                'stock': 55
            },
            {
                'name': 'Florero de Vidrio Reciclado',
                'description': 'Hermoso florero hecho 100% de vidrio reciclado. Ideal para flores o decoración.',
                'price': 3700.00,
                'stock': 25
            },
            {
                'name': 'Set de Té Orgánico',
                'description': 'Set de té de cerámica hecho con materiales naturales. Incluye tetera y 4 tazas.',
                'price': 3990.00,
                'stock': 20
            },
            {
                'name': 'Soporte para Teléfono de Bambú',
                'description': 'Soporte ajustable para teléfono hecho de bambú sustentable. Perfecto para videollamadas.',
                'price': 3550.00,
                'stock': 95
            },
            {
                'name': 'Detergente Ecológico para Ropa',
                'description': 'Detergente para ropa a base de plantas en envase biodegradable. Suave con la ropa y el ambiente.',
                'price': 3600.00,
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