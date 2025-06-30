from django.db import models

# Create your models here.

class SpecialDatePromotion(models.Model):
    """
    Model for special date promotions and date ranges.
    """
    start_date = models.DateField(help_text='Start date of the promotion period')
    end_date = models.DateField(help_text='End date of the promotion period')
    description = models.CharField(max_length=200, help_text='Description of the promotion')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Special Date Promotion'
        verbose_name_plural = 'Special Date Promotions'
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.description} ({self.start_date} - {self.end_date})"

    def is_active_on_date(self, target_date):
        """
        Check if promotion is active on a specific date.
        """
        return self.start_date <= target_date <= self.end_date
