// src/app.js
const express = require('express');
const cors = require('cors');
const tasksRouter = require('./routes/tasks');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/tasks', tasksRouter);

// health
app.get('/health', (req, res) => res.json({ ok: true }));

module.exports = app;
