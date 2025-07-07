from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List
from app.models.models import BookingStatus

# Base schemas
class VenueBase(BaseModel):
    name: str
    location: str
    capacity: int
    description: Optional[str] = None

class EventBase(BaseModel):
    name: str
    description: Optional[str] = None
    date: datetime
    venue_id: int

class TicketTypeBase(BaseModel):
    name: str
    price: float
    quantity_available: int
    event_id: int

class BookingBase(BaseModel):
    user_name: str
    user_email: str
    quantity: int
    event_id: int
    ticket_type_id: int

# Create schemas
class VenueCreate(VenueBase):
    pass

class EventCreate(EventBase):
    pass

class TicketTypeCreate(TicketTypeBase):
    pass

class BookingCreate(BookingBase):
    pass

# Read schemas
class Venue(VenueBase):
    id: int
    
    class Config:
        orm_mode = True

class Event(EventBase):
    id: int
    
    class Config:
        orm_mode = True

class TicketType(TicketTypeBase):
    id: int
    
    class Config:
        orm_mode = True

class Booking(BookingBase):
    id: int
    total_price: float
    booking_date: datetime
    status: BookingStatus
    confirmation_code: str
    
    class Config:
        orm_mode = True

# Relationships schemas
class EventWithVenue(Event):
    venue: Venue

class EventWithTickets(Event):
    ticket_types: List[TicketType]

class EventWithBookings(Event):
    bookings: List[Booking]

class VenueWithEvents(Venue):
    events: List[Event]

class TicketTypeWithBookings(TicketType):
    bookings: List[Booking]

class BookingWithDetails(Booking):
    event: Event
    ticket_type: TicketType

# Update schemas
class BookingUpdate(BaseModel):
    user_name: Optional[str] = None
    user_email: Optional[str] = None
    quantity: Optional[int] = None
    
class BookingStatusUpdate(BaseModel):
    status: BookingStatus

# Statistics schemas
class EventRevenue(BaseModel):
    event_id: int
    event_name: str
    total_revenue: float
    tickets_sold: int
    tickets_available: int

class VenueOccupancy(BaseModel):
    venue_id: int
    venue_name: str
    capacity: int
    total_bookings: int
    occupancy_rate: float

class BookingSystemStats(BaseModel):
    total_events: int
    total_venues: int
    total_bookings: int
    total_revenue: float
    available_tickets: int 