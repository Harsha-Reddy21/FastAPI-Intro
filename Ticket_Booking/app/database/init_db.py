from sqlalchemy.orm import Session
from app.models.models import Base, Venue, Event, TicketType, Booking, BookingStatus
from app.database.database import engine, SessionLocal
from datetime import datetime, timedelta
import random

# Create tables
def create_tables():
    Base.metadata.create_all(bind=engine)

# Add sample data
def add_sample_data():
    db = SessionLocal()
    try:
        # Check if we already have data
        if db.query(Venue).count() > 0:
            return
        
        # Add venues
        venues = [
            Venue(name="Grand Arena", location="Downtown", capacity=5000, description="A large venue for concerts and sports events"),
            Venue(name="City Theater", location="Westside", capacity=1000, description="A medium-sized theater for plays and performances"),
            Venue(name="Community Hall", location="Eastside", capacity=300, description="A small venue for community events")
        ]
        db.add_all(venues)
        db.commit()
        
        # Add events
        now = datetime.now()
        events = [
            Event(name="Rock Concert", description="Annual rock music festival", date=now + timedelta(days=30), venue_id=1),
            Event(name="Classical Symphony", description="Mozart and Beethoven classics", date=now + timedelta(days=15), venue_id=2),
            Event(name="Comedy Night", description="Stand-up comedy show", date=now + timedelta(days=7), venue_id=3),
            Event(name="Jazz Festival", description="Featuring top jazz artists", date=now + timedelta(days=45), venue_id=1)
        ]
        db.add_all(events)
        db.commit()
        
        # Add ticket types
        ticket_types = [
            # For Rock Concert
            TicketType(name="VIP", price=150.00, quantity_available=100, event_id=1),
            TicketType(name="Standard", price=75.00, quantity_available=1000, event_id=1),
            TicketType(name="Economy", price=40.00, quantity_available=3000, event_id=1),
            
            # For Classical Symphony
            TicketType(name="Premium", price=120.00, quantity_available=200, event_id=2),
            TicketType(name="Regular", price=60.00, quantity_available=800, event_id=2),
            
            # For Comedy Night
            TicketType(name="Front Row", price=80.00, quantity_available=50, event_id=3),
            TicketType(name="General", price=40.00, quantity_available=250, event_id=3),
            
            # For Jazz Festival
            TicketType(name="VIP", price=200.00, quantity_available=200, event_id=4),
            TicketType(name="Regular", price=100.00, quantity_available=4800, event_id=4)
        ]
        db.add_all(ticket_types)
        db.commit()
        
        # Add some sample bookings
        bookings = [
            Booking(
                user_name="John Doe",
                user_email="john@example.com",
                quantity=2,
                total_price=150.00,
                booking_date=datetime.now() - timedelta(days=5),
                status=BookingStatus.CONFIRMED,
                confirmation_code="ABC12345",
                event_id=1,
                ticket_type_id=2
            ),
            Booking(
                user_name="Jane Smith",
                user_email="jane@example.com",
                quantity=4,
                total_price=240.00,
                booking_date=datetime.now() - timedelta(days=3),
                status=BookingStatus.CONFIRMED,
                confirmation_code="DEF67890",
                event_id=2,
                ticket_type_id=5
            ),
            Booking(
                user_name="Bob Johnson",
                user_email="bob@example.com",
                quantity=1,
                total_price=80.00,
                booking_date=datetime.now() - timedelta(days=1),
                status=BookingStatus.PENDING,
                confirmation_code="GHI13579",
                event_id=3,
                ticket_type_id=6
            )
        ]
        db.add_all(bookings)
        db.commit()
    finally:
        db.close()

if __name__ == "__main__":
    create_tables()
    add_sample_data() 