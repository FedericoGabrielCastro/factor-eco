from django.contrib import admin
from .models import Cart, CartItem


class CartItemInline(admin.TabularInline):
    """
    Inline admin for CartItem model.
    """
    model = CartItem
    extra = 0
    readonly_fields = ['unit_price', 'created_at', 'updated_at']


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    """
    Admin configuration for Cart model.
    """
    list_display = ['id', 'user', 'cart_type', 'status', 'get_subtotal_display', 'created_at']
    list_filter = ['cart_type', 'status', 'created_at']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [CartItemInline]
    ordering = ['-created_at']

    def get_subtotal_display(self, obj):
        """Display subtotal in admin list."""
        return f"${obj.get_subtotal():.2f}"
    get_subtotal_display.short_description = 'Subtotal'


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    """
    Admin configuration for CartItem model.
    """
    list_display = ['id', 'cart', 'product', 'quantity', 'unit_price', 'get_total_price_display']
    list_filter = ['created_at']
    search_fields = ['cart__user__username', 'product__name']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']

    def get_total_price_display(self, obj):
        """Display total price in admin list."""
        return f"${obj.get_total_price():.2f}"
    get_total_price_display.short_description = 'Total Price'
