# Generated by Django 5.2.3 on 2025-06-30 22:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('promotions', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='specialdatepromotion',
            name='discount_percentage',
            field=models.DecimalField(decimal_places=2, default=0, help_text='Discount percentage (e.g. 20.00 for 20%)', max_digits=5),
        ),
    ]
