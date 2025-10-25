// src/routes/tasks.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/tasksController');

router.post('/', async (req, res, next) => {
  try { await ctrl.createTask(req, res); } catch (e) { next(e); }
});

router.get('/', async (req, res, next) => {
  try { await ctrl.listRecentFive(req, res); } catch (e) { next(e); }
});

router.post('/:id/done', async (req, res, next) => {
  try { await ctrl.markDone(req, res); } catch (e) { next(e); }
});

module.exports = router;
