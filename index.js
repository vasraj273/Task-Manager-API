const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let tasks = [];
let taskId = 1;


app.post('/tasks', (req, res) => {
  const { title, description, status } = req.body;

  // Basic validation
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required.' });
  }

  const newTask = {
    id: taskId++, // auto-incrementing ID
    title,
    description,
    status: status || 'pending', // default to 'pending' if not given
  };

  tasks.push(newTask); // Add to our in-memory storage

  res.status(201).json(newTask); // Return the new task
});

app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.patch('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const { status } = req.body;

  console.log("Incoming PATCH ID:", taskId);
  console.log("Incoming status from body:", status);

  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  task.status = status || task.status;

  console.log("Updated task:", task);

  res.status(200).json({ message: 'Task updated successfully', task });
});


app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);

  const index = tasks.findIndex(t => t.id === taskId);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const deletedTask = tasks.splice(index, 1);

  res.status(200).json({ message: 'Task deleted successfully', task: deletedTask[0] });
});
