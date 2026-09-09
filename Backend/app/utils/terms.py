from datetime import datetime

def calculate_target_term(custom_date: datetime = None) -> str:
    """
    Dynamically computes the next standard university intake term (Fall or Spring)
    based on the current date or a provided target date.
    """
    now = custom_date or datetime.utcnow()
    current_year = now.year
    current_month = now.month

    # Admissions cycle logic:
    # If it's between January and June, the immediate upcoming main intake is Fall of the same year.
    # If it's between July and December, the immediate upcoming main intake is Spring or Fall of the next year.
    if current_month <= 5:
        return f"Fall {current_year}"
    elif current_month <= 10:
        return f"Spring {current_year + 1}"
    else:
        return f"Fall {current_year + 1}"