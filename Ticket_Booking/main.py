from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import events, venues, ticket_types, bookings, stats

app = FastAPI(title="Ticket Booking System", 
              description="API for managing events, venues, ticket types, and bookings",
              version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(events.router, prefix="/events", tags=["Events"])
app.include_router(venues.router, prefix="/venues", tags=["Venues"])
app.include_router(ticket_types.router, prefix="/ticket-types", tags=["Ticket Types"])
app.include_router(bookings.router, prefix="/bookings", tags=["Bookings"])
app.include_router(stats.router, prefix="/booking-system", tags=["Statistics"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Ticket Booking System API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 