import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/todos`);
      setTodos(res.data);
    } catch (err) {
      setError('Failed to load todos');
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/todos`, { text: newTodo });
      setTodos([...todos, res.data]);
      setNewTodo('');
    } catch (err) {
      setError('Failed to add todo');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    setIsLoading(true);
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      setTodos(todos.filter(t => t._id !== id));
    } catch (err) {
      setError('Failed to delete todo');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTodo = async (id) => {
    setIsLoading(true);
    try {
      const res = await axios.put(`${API_URL}/todos/${id}`, { completed: !todos.find(t => t._id === id).completed });
      setTodos(todos.map(t => t._id === id ? res.data : t));
    } catch (err) {
      setError('Failed to update todo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      {error && <div className="error">{error}</div>}
      <h1 className="title">Todo App</h1>
      <div className="input-group">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
        />
        <button onClick={addTodo} disabled={!newTodo || isLoading}>Add</button>
      </div>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo._id} className="todo-item">
            <span>{todo.text}</span>
            <button onClick={() => toggleTodo(todo._id)}>Toggle</button>
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;