from rest_framework import serializers
from .models import SpecialDatePromotion


class SpecialDatePromotionSerializer(serializers.ModelSerializer):
    """
    Serializer for SpecialDatePromotion model.
    """
    class Meta:
        model = SpecialDatePromotion
        fields = [
            'id',
            'start_date',
            'end_date',
            'description',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at'] 