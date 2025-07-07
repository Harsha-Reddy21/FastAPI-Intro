from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.models.models import Event, Venue, Booking, TicketType
from app.schemas.schemas import Event as EventSchema
from app.schemas.schemas import EventCreate, EventWithVenue, EventWithBookings, Booking as BookingSchema, TicketType as TicketTypeSchema

router = APIRouter()

@router.post("/", response_model=EventSchema, status_code=status.HTTP_201_CREATED)
def create_event(event: EventCreate, db: Session = Depends(get_db)):
    """Create a new event."""
    # Check if venue exists
    venue = db.query(Venue).filter(Venue.id == event.venue_id).first()
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    
    db_event = Event(**event.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@router.get("/", response_model=List[EventWithVenue])
def get_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all events with venue information."""
    events = db.query(Event).offset(skip).limit(limit).all()
    return events

@router.get("/{event_id}", response_model=EventWithVenue)
def get_event(event_id: int, db: Session = Depends(get_db)):
    """Get a specific event by ID."""
    event = db.query(Event).filter(Event.id == event_id).first()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.get("/{event_id}/bookings", response_model=List[BookingSchema])
def get_event_bookings(event_id: int, db: Session = Depends(get_db)):
    """Get all bookings for a specific event."""
    event = db.query(Event).filter(Event.id == event_id).first()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    
    bookings = db.query(Booking).filter(Booking.event_id == event_id).all()
    return bookings

@router.get("/{event_id}/available-tickets", response_model=List[dict])
def get_available_tickets(event_id: int, db: Session = Depends(get_db)):
    """Get available tickets for an event."""
    event = db.query(Event).filter(Event.id == event_id).first()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    
    ticket_types = db.query(TicketType).filter(TicketType.event_id == event_id).all()
    
    result = []
    for ticket_type in ticket_types:
        # Calculate how many tickets are already booked
        booked_tickets = db.query(Booking).filter(
            Booking.ticket_type_id == ticket_type.id,
            Booking.status != "cancelled"
        ).with_entities(Booking.quantity).all()
        
        total_booked = sum(booking.quantity for booking in booked_tickets)
        available = ticket_type.quantity_available - total_booked
        
        result.append({
            "ticket_type_id": ticket_type.id,
            "name": ticket_type.name,
            "price": ticket_type.price,
            "available": available,
            "total": ticket_type.quantity_available
        })
    
    return result

@router.get("/{event_id}/revenue", response_model=dict)
def get_event_revenue(event_id: int, db: Session = Depends(get_db)):
    """Calculate total revenue for a specific event."""
    event = db.query(Event).filter(Event.id == event_id).first()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Get all confirmed bookings for this event
    bookings = db.query(Booking).filter(
        Booking.event_id == event_id,
        Booking.status == "confirmed"
    ).all()
    
    total_revenue = sum(booking.total_price for booking in bookings)
    tickets_sold = sum(booking.quantity for booking in bookings)
    
    # Calculate total available tickets
    ticket_types = db.query(TicketType).filter(TicketType.event_id == event_id).all()
    total_tickets = sum(tt.quantity_available for tt in ticket_types)
    
    return {
        "event_id": event.id,
        "event_name": event.name,
        "total_revenue": total_revenue,
        "tickets_sold": tickets_sold,
        "tickets_available": total_tickets - tickets_sold
    } 