import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';

function App() {
  const [todos, setTodos] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // New state for search term

  // Fetch all todos or search based on query
  useEffect(() => {
    const url = searchTerm 
      ? `http://localhost:5000/api/todos/search?query=${searchTerm}` // Search query
      : 'http://localhost:5000/api/todos'; // Get all todos if no search term

    axios.get(url)
      .then(response => setTodos(response.data))
      .catch(error => console.log(error));
  }, [searchTerm]); // Re-fetch todos when search term changes

  const addTodo = (newTodo) => {
    axios.post('http://localhost:5000/api/todos', newTodo)
      .then(response => setTodos([...todos, response.data]))
      .catch(error => console.log(error));
  };

  const updateTodo = (updatedTodo) => {
    axios.put(`http://localhost:5000/api/todos/${updatedTodo._id}`, updatedTodo)
      .then(response => {
        const updatedTodos = todos.map(todo =>
          todo._id === updatedTodo._id ? response.data : todo
        );
        setTodos(updatedTodos);
      })
      .catch(error => console.log(error));
  };

  const deleteTodo = (id) => {
    axios.delete(`http://localhost:5000/api/todos/${id}`)
      .then(() => setTodos(todos.filter(todo => todo._id !== id)))
      .catch(error => console.log(error));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Update search term state
  };

  return (
    <div className="App">
      <h1>To-Do App</h1>
      
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search todos..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      
      <TodoForm addTodo={addTodo} />
      <div className="todo-list">
        {todos.length === 0 ? (
          <p>No tasks found</p> // Display message when no todos match search
        ) : (
          todos.map(todo => (
            <TodoItem
              key={todo._id}
              todo={todo}
              updateTodo={updateTodo}
              deleteTodo={deleteTodo}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;
