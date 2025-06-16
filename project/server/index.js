import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for tasks
let tasks = [
  {
    id: 1,
    name: "Complete project documentation",
    description: "Write comprehensive documentation for the task management system",
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Review code changes",
    description: "Review and approve pending pull requests",
    completed: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "Plan next sprint",
    description: "Organize tasks and priorities for the upcoming development sprint",
    completed: false,
    createdAt: new Date().toISOString()
  }
];

let nextId = 4;

// Helper function to find task by ID
const findTaskById = (id) => {
  return tasks.find(task => task.id === parseInt(id));
};

// GET /tasks - Retrieve all tasks
app.get('/api/tasks', (req, res) => {
  try {
    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve tasks'
    });
  }
});

// POST /tasks - Create a new task
app.post('/api/tasks', (req, res) => {
  try {
    const { name, description } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Task name is required'
      });
    }

    const newTask = {
      id: nextId++,
      name: name.trim(),
      description: description?.trim() || '',
      completed: false,
      createdAt: new Date().toISOString()
    };

    tasks.push(newTask);

    res.status(201).json({
      success: true,
      data: newTask,
      message: 'Task created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create task'
    });
  }
});

// PUT /tasks/:id - Update a task
app.put('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, completed } = req.body;

    const task = findTaskById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Validation
    if (name !== undefined && (!name || !name.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Task name cannot be empty'
      });
    }

    // Update task fields
    if (name !== undefined) task.name = name.trim();
    if (description !== undefined) task.description = description.trim();
    if (completed !== undefined) task.completed = Boolean(completed);
    task.updatedAt = new Date().toISOString();

    res.json({
      success: true,
      data: task,
      message: 'Task updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update task'
    });
  }
});

// DELETE /tasks/:id - Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const taskIndex = tasks.findIndex(task => task.id === parseInt(id));

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];

    res.json({
      success: true,
      data: deletedTask,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete task'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not foundhh'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api/tasks`);
});