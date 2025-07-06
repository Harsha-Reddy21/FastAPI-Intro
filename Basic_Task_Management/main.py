from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Task model
class Task(BaseModel):
    id: Optional[int] = None
    title: str
    description: str
    completed: bool = False

# In-memory storage
tasks = []
task_counter = 1

# Get all tasks
@app.get("/tasks", response_model=List[Task])
def get_tasks():
    return tasks

# Create a new task
@app.post("/tasks", response_model=Task, status_code=201)
def create_task(task: Task):
    global task_counter
    task.id = task_counter
    task_counter += 1
    tasks.append(task)
    return task

# Update a task
@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: int, updated_task: Task):
    for i, task in enumerate(tasks):
        if task.id == task_id:
            updated_task.id = task_id  # Ensure ID remains the same
            tasks[i] = updated_task
            return updated_task
    raise HTTPException(status_code=404, detail="Task not found")

# Delete a task
@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int):
    for i, task in enumerate(tasks):
        if task.id == task_id:
            tasks.pop(i)
            return
    raise HTTPException(status_code=404, detail="Task not found")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 