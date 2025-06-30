from django.test import TestCase, Client
from django.urls import reverse
from datetime import date
from .models import SpecialDatePromotion


class SpecialDatePromotionTests(TestCase):
    """
    Tests for SpecialDatePromotion functionality.
    """
    
    def setUp(self):
        """
        Set up test data.
        """
        self.client = Client()
        
        # Create test promotions
        self.promotion_june = SpecialDatePromotion.objects.create(
            start_date=date(2025, 6, 1),
            end_date=date(2025, 6, 30),
            description='Summer Sale - June 2025'
        )
        
        self.promotion_july = SpecialDatePromotion.objects.create(
            start_date=date(2025, 7, 1),
            end_date=date(2025, 7, 31),
            description='July Special Offers'
        )
        
        self.promotion_august = SpecialDatePromotion.objects.create(
            start_date=date(2025, 8, 1),
            end_date=date(2025, 8, 15),
            description='Back to School Promotion'
        )

    def test_promotion_list_without_date_parameter(self):
        """
        Test that promotions endpoint works without date parameter.
        """
        response = self.client.get('/promotions/special-dates/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('effective_date', response.json())
        self.assertIn('promotions', response.json())

    def test_promotion_list_with_valid_date_parameter(self):
        """
        Test that promotions endpoint filters correctly with valid date parameter.
        """
        # Test June 15th - should return June promotion
        response = self.client.get('/promotions/special-dates/?fecha=2025-06-15')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['effective_date'], '2025-06-15')
        self.assertEqual(len(data['promotions']), 1)
        self.assertEqual(data['promotions'][0]['description'], 'Summer Sale - June 2025')

    def test_promotion_list_with_different_dates(self):
        """
        Test that different dates return different promotions.
        """
        # Test July 10th - should return July promotion
        response = self.client.get('/promotions/special-dates/?fecha=2025-07-10')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data['promotions']), 1)
        self.assertEqual(data['promotions'][0]['description'], 'July Special Offers')

        # Test August 5th - should return August promotion
        response = self.client.get('/promotions/special-dates/?fecha=2025-08-05')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data['promotions']), 1)
        self.assertEqual(data['promotions'][0]['description'], 'Back to School Promotion')

    def test_promotion_list_with_invalid_date_parameter(self):
        """
        Test that invalid date parameter falls back to today's date.
        """
        response = self.client.get('/promotions/special-dates/?fecha=invalid-date')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('effective_date', data)
        self.assertIn('promotions', data)

    def test_promotion_list_with_date_outside_ranges(self):
        """
        Test that dates outside promotion ranges return empty list.
        """
        # Test September 1st - should return no promotions
        response = self.client.get('/promotions/special-dates/?fecha=2025-09-01')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data['promotions']), 0)

    def test_promotion_model_methods(self):
        """
        Test the is_active_on_date method of the model.
        """
        # Test within range
        self.assertTrue(self.promotion_june.is_active_on_date(date(2025, 6, 15)))
        
        # Test on start date
        self.assertTrue(self.promotion_june.is_active_on_date(date(2025, 6, 1)))
        
        # Test on end date
        self.assertTrue(self.promotion_june.is_active_on_date(date(2025, 6, 30)))
        
        # Test outside range
        self.assertFalse(self.promotion_june.is_active_on_date(date(2025, 7, 1)))
        self.assertFalse(self.promotion_june.is_active_on_date(date(2025, 5, 31)))
