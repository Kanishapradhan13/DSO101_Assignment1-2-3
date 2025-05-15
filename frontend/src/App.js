import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  
  // Get the API URL from environment variables
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);
  
  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/todos`);
      console.log('Fetched todos:', response.data); // Debug: Log the data structure
      setTodos(response.data);
    } catch (err) {
      console.error('Error fetching todos:', err);
    }
  };
  
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    try {
      await axios.post(`${API_URL}/api/todos`, { text: newTodo });
      setNewTodo('');
      fetchTodos();
    } catch (err) {
      console.error('Error adding todo:', err);
    }
  };
  
  const deleteTodo = async (id) => {
    try {
      console.log('Deleting todo with id:', id); // Debug
      await axios.delete(`${API_URL}/api/todos/${id}`);
      fetchTodos();
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  };
  
  const toggleComplete = async (todo) => {
    try {
      await axios.put(`${API_URL}/api/todos/${todo.id}`, {
        completed: !todo.completed
      });
      fetchTodos();
    } catch (err) {
      console.error('Error updating todo:', err);
    }
  };
  
  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };
  
  const submitEdit = async (id) => {
    if (!editText.trim()) return;
    
    try {
      await axios.put(`${API_URL}/api/todos/${id}`, { text: editText });
      setEditingId(null);
      fetchTodos();
    } catch (err) {
      console.error('Error updating todo:', err);
    }
  };
  
  return (
    <div className="App">
      <h1>Todo List</h1>
      
      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task"
        />
        <button type="submit">Add</button>
      </form>
      
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            {editingId === todo.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={() => submitEdit(todo.id)}>Save</button>
              </div>
            ) : (
              <>
                <span
                  className="todo-text"
                  onClick={() => toggleComplete(todo)}
                >
                  {todo.text}
                </span>
                <div className="todo-actions">
                  <button onClick={() => startEditing(todo)}>Edit</button>
                  <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;