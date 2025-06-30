from django.contrib import admin
from .models import Order

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'cart', 'ordered_at', 'total_paid']
    list_filter = ['ordered_at']
    search_fields = ['cart__user__username']
    readonly_fields = ['ordered_at']
    ordering = ['-ordered_at']
