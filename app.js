require('dotenv').config();

const express = require('express');
const { parse } = require('node:path');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

let todos = [
    { id: 1, task: "Learn Node.js", completed: false },
    { id: 2, task: "Build CRUD API", completed: false },
    { id: 3, task: "Test API", completed: true }
];

// Get all todos-Read
app.get('/todos', (req, res)=> {
    res.status(200).json(todos); // Send the list of todos as JSON
});

// Get a single todo by ID-Read)(Assignment)
app.get('/todos/:id', (req, res) => {
    const todo = todos.find((t) => t.id === parseInt(req.params.id));
    if (!todo) 
        return res.status(404).json({message: "Todo not found"});
    res.status(200).json(todo); // Send the found todo as JSON
});

// Create a new todo-Create
app.post('/todos', (req, res) => {
    const newTodo = { id: todos.length + 1, ...req.body};
    
    const {task, completed} = req.body;
    if (!task) {
        return res.status(404).json({error: "Task is required" });
    }
    if (completed === undefined) {
        return res.status(404).json({error: "Completed status is required"})
    }
    
    todos.push(newTodo); 
    res.status(201).json(newTodo); // Send the created todo as JSON
});

// Update a todo-Update-patch
app.patch('/todos/:id', (req, res) => {
    const todo = todos.find((t) => t.id === parseInt(req.params.id));
    if (!todo) 
        return res.status(404).json({message: "Todo not found"});
    Object.assign(todo, req.body); // Update the todo with the new data
    res.status(200).json(todo); // Send the updated todo as JSON
});

// Delete a todo-Delete
app.delete('/todos/:id', (req, res) => {
const id = parseInt(req.params.id);
const initialLength = todos.length;
todos = todos.filter((t) => t.id !== id); // Remove the todo with the specified ID
if (todos.length === initialLength)
    return res.status(404).json({message: "Todo not found"});
 res.status(204).send(); // Send a 204 No Content response

});

app.use((err, req, res, next) => {
    res.status(500).json({ error: "Server Error" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`APP is Listening on port ${PORT}`);
});

app.get('/todos/active', (req, res) => {
    const activeTodos = todos.filter(todo => !todo.completed);

    res.status(200).json(activeTodos);
});

app.get('/todos/completed', (req, res) => {
    const completedTodos = todos.filter((todo) => todo.completed === true);
    res.status(200).json(completedTodos);
});