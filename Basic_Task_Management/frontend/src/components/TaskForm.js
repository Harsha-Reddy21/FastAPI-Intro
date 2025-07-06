import React, { useState } from 'react';

function TaskForm({ onCreateTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Title is required');
      return;
    }
    
    const newTask = {
      title,
      description,
      completed: false
    };
    
    onCreateTask(newTask);
    
    // Reset form
    setTitle('');
    setDescription('');
  };
  
  return (
    <div className="card">
      <div className="card-header">
        <h3>Add New Task</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              className="form-control"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows="3"
            />
          </div>
          
          <button type="submit" className="btn btn-primary">
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
}

export default TaskForm; 