import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const API_URL = 'http://localhost:8000';

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/tasks`);
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new task
  const createTask = async (task) => {
    try {
      const response = await axios.post(`${API_URL}/tasks`, task);
      setTasks([...tasks, response.data]);
    } catch (err) {
      setError('Failed to create task');
      console.error(err);
    }
  };

  // Update a task
  const updateTask = async (id, updatedTask) => {
    try {
      await axios.put(`${API_URL}/tasks/${id}`, updatedTask);
      setTasks(tasks.map(task => task.id === id ? updatedTask : task));
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
    }
  };

  // Toggle task completion status
  const toggleComplete = async (task) => {
    const updatedTask = { ...task, completed: !task.completed };
    await updateTask(task.id, updatedTask);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Task Management App</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="row">
        <div className="col-md-4">
          <TaskForm onCreateTask={createTask} />
        </div>
        <div className="col-md-8">
          {loading ? (
            <p>Loading tasks...</p>
          ) : (
            <TaskList 
              tasks={tasks} 
              onToggleComplete={toggleComplete} 
              onDeleteTask={deleteTask} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App; 