from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from sqlalchemy import or_

from app.database.database import get_db
from app.models.models import Booking, Event, Venue, TicketType, BookingStatus
from app.schemas.schemas import Booking as BookingSchema
from app.schemas.schemas import BookingCreate, BookingUpdate, BookingStatusUpdate, BookingWithDetails
from app.utils.helpers import generate_confirmation_code, calculate_total_price, check_ticket_availability, update_ticket_availability

router = APIRouter()

@router.post("/", response_model=BookingSchema, status_code=status.HTTP_201_CREATED)
def create_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    """Create a new booking."""
    # Check if event exists
    event = db.query(Event).filter(Event.id == booking.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Check if ticket type exists
    ticket_type = db.query(TicketType).filter(TicketType.id == booking.ticket_type_id).first()
    if not ticket_type:
        raise HTTPException(status_code=404, detail="Ticket type not found")
    
    # Check if ticket type belongs to the event
    if ticket_type.event_id != booking.event_id:
        raise HTTPException(status_code=400, detail="Ticket type does not belong to this event")
    
    # Check ticket availability
    if not check_ticket_availability(db, booking.ticket_type_id, booking.quantity):
        raise HTTPException(status_code=400, detail="Not enough tickets available")
    
    # Calculate total price
    total_price = calculate_total_price(db, booking.ticket_type_id, booking.quantity)
    if total_price is None:
        raise HTTPException(status_code=400, detail="Could not calculate total price")
    
    # Generate confirmation code
    confirmation_code = generate_confirmation_code()
    
    # Create booking
    db_booking = Booking(
        **booking.dict(),
        total_price=total_price,
        confirmation_code=confirmation_code,
        status=BookingStatus.PENDING
    )
    
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    
    # Update ticket availability
    update_ticket_availability(db, booking.ticket_type_id, booking.quantity)
    
    return db_booking

@router.get("/", response_model=List[BookingWithDetails])
def get_bookings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all bookings with event, venue, and ticket type details."""
    bookings = db.query(Booking).offset(skip).limit(limit).all()
    return bookings

@router.get("/search", response_model=List[BookingWithDetails])
def search_bookings(
    event: Optional[str] = Query(None, description="Event name to search for"),
    venue: Optional[str] = Query(None, description="Venue name to search for"),
    ticket_type: Optional[str] = Query(None, description="Ticket type to search for"),
    db: Session = Depends(get_db)
):
    """Search bookings by event name, venue, and/or ticket type."""
    query = db.query(Booking).join(Event).join(TicketType)
    
    filters = []
    if event:
        filters.append(Event.name.ilike(f"%{event}%"))
    if venue:
        query = query.join(Venue, Event.venue_id == Venue.id)
        filters.append(Venue.name.ilike(f"%{venue}%"))
    if ticket_type:
        filters.append(TicketType.name.ilike(f"%{ticket_type}%"))
    
    if filters:
        query = query.filter(or_(*filters))
    
    bookings = query.all()
    return bookings

@router.get("/{booking_id}", response_model=BookingWithDetails)
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    """Get a specific booking by ID."""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

@router.put("/{booking_id}", response_model=BookingSchema)
def update_booking(booking_id: int, booking_update: BookingUpdate, db: Session = Depends(get_db)):
    """Update booking details."""
    db_booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if db_booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Update quantity if provided and different
    if booking_update.quantity is not None and booking_update.quantity != db_booking.quantity:
        # Check if new quantity is available
        if booking_update.quantity > db_booking.quantity:
            additional_tickets = booking_update.quantity - db_booking.quantity
            if not check_ticket_availability(db, db_booking.ticket_type_id, additional_tickets):
                raise HTTPException(status_code=400, detail="Not enough tickets available")
            
            # Update ticket availability
            update_ticket_availability(db, db_booking.ticket_type_id, additional_tickets)
        else:
            # Return tickets to available pool
            returned_tickets = db_booking.quantity - booking_update.quantity
            update_ticket_availability(db, db_booking.ticket_type_id, returned_tickets, is_cancellation=True)
        
        # Recalculate total price
        db_booking.total_price = calculate_total_price(db, db_booking.ticket_type_id, booking_update.quantity)
    
    # Update other fields
    update_data = booking_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_booking, key, value)
    
    db.commit()
    db.refresh(db_booking)
    return db_booking

@router.patch("/{booking_id}/status", response_model=BookingSchema)
def update_booking_status(booking_id: int, status_update: BookingStatusUpdate, db: Session = Depends(get_db)):
    """Update booking status (confirmed, cancelled, pending)."""
    db_booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if db_booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    old_status = db_booking.status
    new_status = status_update.status
    
    # If cancelling a booking, return tickets to available pool
    if old_status != BookingStatus.CANCELLED and new_status == BookingStatus.CANCELLED:
        update_ticket_availability(db, db_booking.ticket_type_id, db_booking.quantity, is_cancellation=True)
    
    # If un-cancelling a booking, check if tickets are still available
    if old_status == BookingStatus.CANCELLED and new_status != BookingStatus.CANCELLED:
        if not check_ticket_availability(db, db_booking.ticket_type_id, db_booking.quantity):
            raise HTTPException(status_code=400, detail="Not enough tickets available")
        update_ticket_availability(db, db_booking.ticket_type_id, db_booking.quantity)
    
    db_booking.status = new_status
    db.commit()
    db.refresh(db_booking)
    return db_booking

@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    """Cancel a booking."""
    db_booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if db_booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # If booking is not already cancelled, return tickets to available pool
    if db_booking.status != BookingStatus.CANCELLED:
        update_ticket_availability(db, db_booking.ticket_type_id, db_booking.quantity, is_cancellation=True)
    
    db.delete(db_booking)
    db.commit()
    return None 