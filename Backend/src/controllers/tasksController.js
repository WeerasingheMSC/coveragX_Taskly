// src/controllers/tasksController.js
const db = require('../db');

async function createTask(req, res) {
  const { title, description } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'title is required' });
  }
  const q = `INSERT INTO "task" (title, description) VALUES ($1, $2) RETURNING *`;
  const { rows } = await db.query(q, [title, description || null]);
  res.status(201).json(rows[0]);
}

async function listRecentFive(req, res) {
  // Only non-completed tasks, most recent 5 by created_at desc
  const q = `SELECT id, title, description, created_at FROM "task" WHERE completed = false ORDER BY created_at DESC LIMIT 5`;
  const { rows } = await db.query(q);
  res.json(rows);
}

async function markDone(req, res) {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid id' });
  const q = `UPDATE "task" SET completed = true, completed_at = now() WHERE id = $1 AND completed = false RETURNING id, title`;
  const { rows } = await db.query(q, [id]);
  if (rows.length === 0) return res.status(404).json({ error: 'task not found or already completed' });
  res.json({ success: true, task: rows[0] });
}

module.exports = { createTask, listRecentFive, markDone };
