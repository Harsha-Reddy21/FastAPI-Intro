import random
import string
from sqlalchemy.orm import Session
from app.models.models import TicketType, Booking

def generate_confirmation_code(length=8):
    """Generate a random confirmation code for bookings."""
    chars = string.ascii_uppercase + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

def calculate_total_price(db: Session, ticket_type_id: int, quantity: int):
    """Calculate the total price for a booking based on ticket type and quantity."""
    ticket_type = db.query(TicketType).filter(TicketType.id == ticket_type_id).first()
    if not ticket_type:
        return None
    return ticket_type.price * quantity

def check_ticket_availability(db: Session, ticket_type_id: int, quantity: int):
    """Check if there are enough tickets available for a booking."""
    ticket_type = db.query(TicketType).filter(TicketType.id == ticket_type_id).first()
    if not ticket_type:
        return False
    
    # Calculate how many tickets are already booked
    booked_tickets = db.query(Booking).filter(
        Booking.ticket_type_id == ticket_type_id,
        Booking.status != "cancelled"
    ).with_entities(Booking.quantity).all()
    
    total_booked = sum(booking.quantity for booking in booked_tickets)
    return ticket_type.quantity_available - total_booked >= quantity

def update_ticket_availability(db: Session, ticket_type_id: int, quantity: int, is_cancellation=False):
    """Update ticket availability after a booking or cancellation."""
    ticket_type = db.query(TicketType).filter(TicketType.id == ticket_type_id).first()
    if not ticket_type:
        return False
    
    if is_cancellation:
        # Add tickets back to available pool
        ticket_type.quantity_available += quantity
    else:
        # Remove tickets from available pool
        if ticket_type.quantity_available < quantity:
            return False
        ticket_type.quantity_available -= quantity
    
    db.commit()
    return True 