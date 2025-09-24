import React, { useState, useEffect } from 'react';
import { fetchTasks, createTask, deleteTask } from './api';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const load = async () => {
    const data = await fetchTasks();
    setTasks(data);
  };

  useEffect(() => {
    load();
  }, []);

  const addTask = async () => {
    if (!title) return;
    await createTask({ title, description });
    setTitle('');
    setDescription('');
    await load();
  };

  const remove = async (id) => {
    await deleteTask(id);
    await load();
  };

  return (
    <div className="App">
      <h1>Task Tracker</h1>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={addTask}>Add Task</button>

      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            <strong>{t.title}</strong>: {t.description}
            <button className="del" onClick={() => remove(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

