from django.db import models

# Create your models here.

class Product(models.Model):
    """
    Product model for the e-commerce platform.
    """
    name = models.CharField(max_length=100, help_text='Product name')
    description = models.TextField(help_text='Product description')
    price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        help_text='Product price with two decimal places'
    )
    stock = models.PositiveIntegerField(help_text='Available stock quantity')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Product'
        verbose_name_plural = 'Products'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - ${self.price}"

    @property
    def is_available(self):
        """
        Check if product is available (has stock).
        """
        return self.stock > 0
