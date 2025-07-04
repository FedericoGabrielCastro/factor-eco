from django.apps import AppConfig


class CartsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'carts'

    def ready(self):
        """Import signals when app is ready."""
        import carts.signals
