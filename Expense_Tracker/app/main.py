from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from datetime import date

from .database import engine, Base
from .routers import expenses
from .models import Expense
from sqlalchemy.orm import Session
from .database import SessionLocal

# Create the FastAPI app
app = FastAPI(title="Expense Tracker API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Add sample data if database is empty
def add_sample_data():
    db = SessionLocal()
    try:
        if db.query(Expense).count() == 0:
            sample_expenses = [
                Expense(
                    amount=25.50,
                    category="food",
                    description="Groceries",
                    date=date(2023, 11, 1)
                ),
                Expense(
                    amount=45.00,
                    category="transport",
                    description="Uber ride",
                    date=date(2023, 11, 2)
                ),
                Expense(
                    amount=15.99,
                    category="entertainment",
                    description="Movie ticket",
                    date=date(2023, 11, 3)
                ),
                Expense(
                    amount=120.00,
                    category="utilities",
                    description="Electricity bill",
                    date=date(2023, 11, 5)
                ),
                Expense(
                    amount=800.00,
                    category="rent",
                    description="Monthly rent",
                    date=date(2023, 11, 1)
                ),
            ]
            db.add_all(sample_expenses)
            db.commit()
    except Exception as e:
        print(f"Error adding sample data: {e}")
    finally:
        db.close()

@app.on_event("startup")
def startup_event():
    add_sample_data()

# Create API router
api_router = APIRouter(prefix="/api")

# Add the expenses router to the API router
api_router.include_router(expenses.router, prefix="/expenses")

# Include the API router
app.include_router(api_router)

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to Expense Tracker API"}

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Mount frontend as the last step
app.mount("/frontend", StaticFiles(directory="frontend/build", html=True), name="frontend") 