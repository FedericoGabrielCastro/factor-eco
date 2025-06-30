from django.urls import path
from . import views

urlpatterns = [
    path('special-dates/', views.SpecialDatePromotionListView.as_view(), name='special-dates'),
] 