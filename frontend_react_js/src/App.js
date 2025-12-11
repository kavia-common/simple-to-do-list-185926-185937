import React, { useState, useEffect } from 'react';
import apiClient from './api';
import './App.css';

// PUBLIC_INTERFACE
function App() {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  /**
   * Fetches all todos from the backend and updates the state.
   */
  // PUBLIC_INTERFACE
  const fetchTodos = async () => {
    try {
      const response = await apiClient.get('/todos/');
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  // Fetch todos on initial component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  /**
   * Adds a new todo item.
   * @param {React.FormEvent<HTMLFormElement>} e - The form event.
   */
  // PUBLIC_INTERFACE
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;
    try {
      const response = await apiClient.post('/todos/', { title: newTodoTitle, completed: false });
      setTodos([...todos, response.data]);
      setNewTodoTitle('');
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  /**
   * Toggles the completion status of a todo item.
   * @param {number} id - The ID of the todo to toggle.
   * @param {boolean} completed - The current completion status.
   */
  // PUBLIC_INTERFACE
  const toggleTodo = async (id, completed) => {
    try {
      const todoToUpdate = todos.find(todo => todo.id === id);
      if (!todoToUpdate) return;
      
      const response = await apiClient.put(`/todos/${id}`, { ...todoToUpdate, completed: !completed });
      setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  /**
   * Deletes a todo item.
   * @param {number} id - The ID of the todo to delete.
   */
  // PUBLIC_INTERFACE
  const deleteTodo = async (id) => {
    try {
      await apiClient.delete(`/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error)      {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <form onSubmit={addTodo} className="todo-input-form">
        <input
          type="text"
          className="todo-input"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Add a new task..."
        />
        <button type="submit" className="add-btn">Add</button>
      </form>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
             <input 
                type="checkbox" 
                checked={todo.completed} 
                onChange={() => toggleTodo(todo.id, todo.completed)} 
             />
            <span className="todo-title" onClick={() => toggleTodo(todo.id, todo.completed)}>
              {todo.title}
            </span>
            <button onClick={() => deleteTodo(todo.id)} className="delete-btn">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
