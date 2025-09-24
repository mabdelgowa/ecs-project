import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetch('/api/tasks')  // We'll use an ALB path-based rule later
      .then(res => res.json())
      .then(setTasks);
  }, []);

  const addTask = () => {
    fetch('/api/tasks', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({title, description})
    }).then(() => window.location.reload());
  };

  return (
    <div className="App">
      <h1>Task Tracker</h1>
      <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <input placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map((t, i) => <li key={i}>{t.title}: {t.description}</li>)}
      </ul>
    </div>
  );
}

export default App;

