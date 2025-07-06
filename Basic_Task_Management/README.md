# Task Management Application

A simple task management application with FastAPI backend and React frontend.

## Project Structure

- `main.py` - FastAPI backend
- `frontend/` - React frontend

## Backend Setup

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Run the FastAPI server:
   ```
   python main.py
   ```

3. The API will be available at `http://localhost:8000`
   - API Documentation: `http://localhost:8000/docs`

## Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. The application will be available at `http://localhost:3000`

## API Endpoints

- `GET /tasks` - Fetch all tasks
- `POST /tasks` - Create a new task
- `PUT /tasks/{task_id}` - Update an existing task
- `DELETE /tasks/{task_id}` - Delete a task

## Features

- Display all tasks in a list
- Form to create new tasks
- Buttons to mark tasks as complete/incomplete
- Delete buttons for each task 