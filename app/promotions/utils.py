from datetime import date


def get_effective_date(request):
    """
    Get the effective date for the request.
    Returns request.simulated_date if set by middleware, otherwise date.today().
    """
    if hasattr(request, 'simulated_date'):
        return request.simulated_date
    return date.today() 