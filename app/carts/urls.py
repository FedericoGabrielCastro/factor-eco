from django.urls import path
from .views import CartListCreateView
from . import views

urlpatterns = [
    path('', CartListCreateView.as_view(), name='cart-list-create'),
    path('<int:pk>/', views.CartDetailView.as_view(), name='cart-detail'),
    # Cart items endpoints
    path('<int:cart_id>/items/', views.CartItemCreateView.as_view(), name='cart-item-create'),
    path('<int:cart_id>/items/<int:pk>/', views.CartItemUpdateView.as_view(), name='cart-item-update'),
] 