from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.models.models import Venue, Event
from app.schemas.schemas import Venue as VenueSchema
from app.schemas.schemas import VenueCreate, VenueWithEvents, Event as EventSchema

router = APIRouter()

@router.post("/", response_model=VenueSchema, status_code=status.HTTP_201_CREATED)
def create_venue(venue: VenueCreate, db: Session = Depends(get_db)):
    """Create a new venue."""
    db_venue = Venue(**venue.dict())
    db.add(db_venue)
    db.commit()
    db.refresh(db_venue)
    return db_venue

@router.get("/", response_model=List[VenueSchema])
def get_venues(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all venues."""
    venues = db.query(Venue).offset(skip).limit(limit).all()
    return venues

@router.get("/{venue_id}", response_model=VenueSchema)
def get_venue(venue_id: int, db: Session = Depends(get_db)):
    """Get a specific venue by ID."""
    venue = db.query(Venue).filter(Venue.id == venue_id).first()
    if venue is None:
        raise HTTPException(status_code=404, detail="Venue not found")
    return venue

@router.get("/{venue_id}/events", response_model=List[EventSchema])
def get_venue_events(venue_id: int, db: Session = Depends(get_db)):
    """Get all events at a specific venue."""
    venue = db.query(Venue).filter(Venue.id == venue_id).first()
    if venue is None:
        raise HTTPException(status_code=404, detail="Venue not found")
    
    events = db.query(Event).filter(Event.venue_id == venue_id).all()
    return events

@router.get("/{venue_id}/occupancy", response_model=dict)
def get_venue_occupancy(venue_id: int, db: Session = Depends(get_db)):
    """Get venue occupancy statistics."""
    venue = db.query(Venue).filter(Venue.id == venue_id).first()
    if venue is None:
        raise HTTPException(status_code=404, detail="Venue not found")
    
    # Get all events at this venue
    events = db.query(Event).filter(Event.venue_id == venue_id).all()
    
    # Calculate total bookings across all events
    total_bookings = 0
    for event in events:
        event_bookings = sum(booking.quantity for booking in event.bookings if booking.status != "cancelled")
        total_bookings += event_bookings
    
    # Calculate occupancy rate
    occupancy_rate = (total_bookings / venue.capacity) * 100 if venue.capacity > 0 else 0
    
    return {
        "venue_id": venue.id,
        "venue_name": venue.name,
        "capacity": venue.capacity,
        "total_bookings": total_bookings,
        "occupancy_rate": round(occupancy_rate, 2)
    } 