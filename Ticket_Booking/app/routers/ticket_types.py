from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.models.models import TicketType, Event, Booking
from app.schemas.schemas import TicketType as TicketTypeSchema
from app.schemas.schemas import TicketTypeCreate, TicketTypeWithBookings, Booking as BookingSchema

router = APIRouter()

@router.post("/", response_model=TicketTypeSchema, status_code=status.HTTP_201_CREATED)
def create_ticket_type(ticket_type: TicketTypeCreate, db: Session = Depends(get_db)):
    """Create a new ticket type."""
    # Check if event exists
    event = db.query(Event).filter(Event.id == ticket_type.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    db_ticket_type = TicketType(**ticket_type.dict())
    db.add(db_ticket_type)
    db.commit()
    db.refresh(db_ticket_type)
    return db_ticket_type

@router.get("/", response_model=List[TicketTypeSchema])
def get_ticket_types(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all ticket types."""
    ticket_types = db.query(TicketType).offset(skip).limit(limit).all()
    return ticket_types

@router.get("/{type_id}", response_model=TicketTypeSchema)
def get_ticket_type(type_id: int, db: Session = Depends(get_db)):
    """Get a specific ticket type by ID."""
    ticket_type = db.query(TicketType).filter(TicketType.id == type_id).first()
    if ticket_type is None:
        raise HTTPException(status_code=404, detail="Ticket type not found")
    return ticket_type

@router.get("/{type_id}/bookings", response_model=List[BookingSchema])
def get_ticket_type_bookings(type_id: int, db: Session = Depends(get_db)):
    """Get all bookings for a specific ticket type."""
    ticket_type = db.query(TicketType).filter(TicketType.id == type_id).first()
    if ticket_type is None:
        raise HTTPException(status_code=404, detail="Ticket type not found")
    
    bookings = db.query(Booking).filter(Booking.ticket_type_id == type_id).all()
    return bookings 