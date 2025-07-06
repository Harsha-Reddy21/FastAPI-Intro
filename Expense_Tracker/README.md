# Expense Tracker Application

A full-stack expense tracking application built with FastAPI backend and React frontend.

## Features

- Track expenses with amount, category, description, and date
- Filter expenses by category and date range
- View expense summaries by category
- CRUD operations for expenses
- Data validation
- Responsive UI

## Tech Stack

- **Backend**: FastAPI, SQLAlchemy, SQLite
- **Frontend**: React, Bootstrap

## Setup Instructions

### Backend Setup

1. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Run the FastAPI server:
   ```
   uvicorn app.main:app --reload
   ```

3. The API will be available at http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install NPM dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. The React app will be available at http://localhost:3000

### Building for Production

1. Build the React app:
   ```
   cd frontend
   npm run build
   ```

2. Run the FastAPI server:
   ```
   uvicorn app.main:app
   ```

3. The full application will be available at http://localhost:8000

## API Endpoints

- `GET /expenses` - Fetch all expenses
- `POST /expenses` - Create a new expense
- `PUT /expenses/{expense_id}` - Update an existing expense
- `DELETE /expenses/{expense_id}` - Delete an expense
- `GET /expenses/category/{category}` - Filter expenses by category
- `GET /expenses/total` - Get total expenses and breakdown by category

## Data Model

Expense:
- id: Integer (primary key)
- amount: Float
- category: String
- description: String (optional)
- date: Date 