import React from 'react';

function TaskList({ tasks, onToggleComplete, onDeleteTask }) {
  if (tasks.length === 0) {
    return <p>No tasks found. Add a new task to get started!</p>;
  }

  return (
    <div>
      <h3 className="mb-3">Your Tasks</h3>
      <div className="list-group">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className={`list-group-item list-group-item-action ${task.completed ? 'bg-light' : ''}`}
          >
            <div className="d-flex w-100 justify-content-between align-items-center">
              <div>
                <h5 className={task.completed ? 'text-decoration-line-through' : ''}>
                  {task.title}
                </h5>
                <p className="mb-1">{task.description}</p>
                <small className={`badge ${task.completed ? 'bg-success' : 'bg-warning'}`}>
                  {task.completed ? 'Completed' : 'Pending'}
                </small>
              </div>
              <div>
                <button 
                  className={`btn btn-sm ${task.completed ? 'btn-outline-secondary' : 'btn-outline-success'} me-2`}
                  onClick={() => onToggleComplete(task)}
                >
                  {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
                </button>
                <button 
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onDeleteTask(task.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskList; 