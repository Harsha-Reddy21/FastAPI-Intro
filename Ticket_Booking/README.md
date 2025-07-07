# Ticket Booking System

A full-stack application for ticket booking management with FastAPI backend and React frontend, demonstrating database relationships between Events, Venues, Ticket Types, and Bookings.

## Features

- **Events Management**: Create, view, and manage events
- **Venues Management**: Create, view, and manage venues
- **Ticket Types**: Define different ticket types with prices
- **Bookings**: Create and manage bookings with status tracking
- **Advanced Queries**: Search bookings, calculate revenue, and track occupancy
- **Relationship Management**: Handle complex relationships between entities
- **React Frontend**: Modern UI for interacting with the system

## API Endpoints

### Events
- `POST /events` - Create new event
- `GET /events` - Get all events
- `GET /events/{event_id}/bookings` - Get all bookings for a specific event
- `GET /events/{event_id}/available-tickets` - Get available tickets for an event
- `GET /events/{event_id}/revenue` - Calculate total revenue for a specific event

### Venues
- `POST /venues` - Create new venue
- `GET /venues` - Get all venues
- `GET /venues/{venue_id}/events` - Get all events at a specific venue
- `GET /venues/{venue_id}/occupancy` - Get venue occupancy statistics

### Ticket Types
- `POST /ticket-types` - Create new ticket type (VIP, Standard, Economy)
- `GET /ticket-types` - Get all ticket types
- `GET /ticket-types/{type_id}/bookings` - Get all bookings for a specific ticket type

### Bookings
- `POST /bookings` - Create new booking
- `GET /bookings` - Get all bookings with event, venue, and ticket type details
- `PUT /bookings/{booking_id}` - Update booking details
- `DELETE /bookings/{booking_id}` - Cancel a booking
- `PATCH /bookings/{booking_id}/status` - Update booking status (confirmed, cancelled, pending)
- `GET /bookings/search?event=name&venue=name&ticket_type=type` - Search bookings by event name, venue, and/or ticket type

### Statistics
- `GET /booking-system/stats` - Get booking statistics (total bookings, events, venues, available tickets)

## Setup and Installation

### Backend (FastAPI)

1. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Run the backend application:
   ```
   python run.py
   ```

3. The API will be available at http://localhost:8000
4. API documentation is available at http://localhost:8000/docs

### Frontend (React)

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install Node.js dependencies:
   ```
   npm install
   ```

3. Run the React development server:
   ```
   npm start
   ```

4. The frontend will be available at http://localhost:3000

## Database Relationships

- **One-to-Many**: Event → Bookings, Venue → Events, Ticket Type → Bookings
- **Many-to-One**: Bookings → Event, Events → Venue, Bookings → Ticket Type
- **Foreign Key Constraints**: Prevent creating bookings with invalid event/venue/ticket type IDs
- **Cascade Operations**: Handle deletions properly
- **Join Operations**: Fetch bookings with related event, venue, and ticket type data in single query

## Frontend Pages

- **Home**: Dashboard with system overview and quick actions
- **Events**: List of events with creation form
- **Event Details**: Detailed view of an event with bookings and revenue
- **Venues**: List of venues with creation form
- **Venue Details**: Detailed view of a venue with events and occupancy
- **Ticket Types**: Manage ticket types for events
- **Bookings**: Create and manage bookings with search functionality
- **Dashboard**: Statistics and system overview 