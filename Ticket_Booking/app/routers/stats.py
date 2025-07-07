from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.database import get_db
from app.models.models import Event, Venue, Booking, TicketType
from app.schemas.schemas import BookingSystemStats

router = APIRouter()

@router.get("/stats", response_model=dict)
def get_booking_stats(db: Session = Depends(get_db)):
    """Get booking statistics (total bookings, events, venues, available tickets)."""
    # Count total events
    total_events = db.query(func.count(Event.id)).scalar()
    
    # Count total venues
    total_venues = db.query(func.count(Venue.id)).scalar()
    
    # Count total bookings
    total_bookings = db.query(func.count(Booking.id)).scalar()
    
    # Calculate total revenue from confirmed bookings
    total_revenue = db.query(func.sum(Booking.total_price)).filter(
        Booking.status == "confirmed"
    ).scalar() or 0
    
    # Calculate available tickets
    # First, get total tickets
    total_tickets = db.query(func.sum(TicketType.quantity_available)).scalar() or 0
    
    # Then, get booked tickets (excluding cancelled)
    booked_tickets = db.query(func.sum(Booking.quantity)).filter(
        Booking.status != "cancelled"
    ).scalar() or 0
    
    available_tickets = total_tickets - booked_tickets
    
    return {
        "total_events": total_events,
        "total_venues": total_venues,
        "total_bookings": total_bookings,
        "total_revenue": float(total_revenue),
        "available_tickets": available_tickets
    } 