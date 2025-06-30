from datetime import date
from django.utils.deprecation import MiddlewareMixin


class DateSimulationMiddleware(MiddlewareMixin):
    """
    Middleware to simulate dates for testing promotions.
    Reads ?fecha=YYYY-MM-DD from request.GET and assigns it to request.simulated_date.
    If not provided or invalid, uses date.today().
    """
    
    def process_request(self, request):
        """
        Process the request and set simulated date.
        """
        fecha_param = request.GET.get('fecha')
        
        if fecha_param:
            try:
                # Parse the date parameter
                year, month, day = map(int, fecha_param.split('-'))
                request.simulated_date = date(year, month, day)
            except (ValueError, TypeError):
                # If date is invalid, use today's date
                request.simulated_date = date.today()
        else:
            # If no date parameter, use today's date
            request.simulated_date = date.today() 