from django.contrib import admin
from .models import SpecialDatePromotion


@admin.register(SpecialDatePromotion)
class SpecialDatePromotionAdmin(admin.ModelAdmin):
    """
    Admin configuration for SpecialDatePromotion model.
    """
    list_display = ['description', 'start_date', 'end_date', 'created_at']
    list_filter = ['start_date', 'end_date', 'created_at']
    search_fields = ['description']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-start_date']
