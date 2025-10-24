// test/unit/tasksController.test.js
const db = require('../../db');
const ctrl = require('../../controllers/tasksController');

jest.mock('../../db');

describe('createTask', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 if no title', async () => {
    const req = { body: { title: '' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await ctrl.createTask(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'title is required' });
  });

  it('returns 400 if title is only whitespace', async () => {
    const req = { body: { title: '   ' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await ctrl.createTask(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('inserts and returns created task with description', async () => {
    const req = { body: { title: 't1', description: 'd' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    db.query.mockResolvedValue({ rows: [{ id: 1, title: 't1', description: 'd' }]});
    await ctrl.createTask(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 1, title: 't1', description: 'd' });
  });

  it('inserts task without description', async () => {
    const req = { body: { title: 'task only' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    db.query.mockResolvedValue({ rows: [{ id: 2, title: 'task only', description: null }]});
    await ctrl.createTask(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(db.query).toHaveBeenCalledWith(
      expect.any(String),
      ['task only', null]
    );
  });
});

describe('listRecentFive', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns empty array if no tasks', async () => {
    const req = {};
    const res = { json: jest.fn() };
    db.query.mockResolvedValue({ rows: [] });
    await ctrl.listRecentFive(req, res);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it('returns only non-completed tasks', async () => {
    const req = {};
    const res = { json: jest.fn() };
    const tasks = [
      { id: 1, title: 't1', description: 'd1', created_at: new Date() },
      { id: 2, title: 't2', description: 'd2', created_at: new Date() }
    ];
    db.query.mockResolvedValue({ rows: tasks });
    await ctrl.listRecentFive(req, res);
    expect(res.json).toHaveBeenCalledWith(tasks);
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('WHERE completed = false')
    );
  });

  it('limits results to 5 tasks', async () => {
    const req = {};
    const res = { json: jest.fn() };
    db.query.mockResolvedValue({ rows: [] });
    await ctrl.listRecentFive(req, res);
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('LIMIT 5')
    );
  });
});

describe('markDone', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 for invalid id', async () => {
    const req = { params: { id: 'abc' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await ctrl.markDone(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'invalid id' });
  });

  it('returns 404 if task not found', async () => {
    const req = { params: { id: '999' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    db.query.mockResolvedValue({ rows: [] });
    await ctrl.markDone(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'task not found or already completed' });
  });

  it('marks task as done and returns success', async () => {
    const req = { params: { id: '1' } };
    const res = { json: jest.fn() };
    db.query.mockResolvedValue({ rows: [{ id: 1, title: 'task1' }] });
    await ctrl.markDone(req, res);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      task: { id: 1, title: 'task1' }
    });
  });

  it('updates completed_at timestamp', async () => {
    const req = { params: { id: '1' } };
    const res = { json: jest.fn() };
    db.query.mockResolvedValue({ rows: [{ id: 1, title: 't' }] });
    await ctrl.markDone(req, res);
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('completed_at = now()'),
      [1]
    );
  });
});
