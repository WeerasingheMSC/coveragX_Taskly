// test/integration/tasks.test.js
const request = require('supertest');
const app = require('../../app');
const db = require('../../db');

describe('Tasks API Integration Tests', () => {
  beforeAll(async () => {
    // Clear test data before running tests
    await db.query('DELETE FROM "task"');
  });

  afterAll(async () => {
    // Clean up and close database connection
    await db.query('DELETE FROM "task"');
    await db.pool.end();
  });

  describe('POST /api/tasks', () => {
    it('should create a new task with title and description', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Buy groceries', description: 'Milk, eggs, bread' })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Buy groceries');
      expect(response.body.description).toBe('Milk, eggs, bread');
      expect(response.body.completed).toBe(false);
    });

    it('should create a task without description', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Call dentist' })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Call dentist');
      expect(response.body.description).toBeNull();
    });

    it('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ description: 'No title here' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 if title is empty string', async () => {
      await request(app)
        .post('/api/tasks')
        .send({ title: '' })
        .expect(400);
    });

    it('should return 400 if title is only whitespace', async () => {
      await request(app)
        .post('/api/tasks')
        .send({ title: '   ' })
        .expect(400);
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      // Clear and seed data
      await db.query('DELETE FROM "task"');
    });

    it('should return empty array when no tasks exist', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return only non-completed tasks', async () => {
      // Create tasks
      await request(app).post('/api/tasks').send({ title: 'Task 1' });
      await request(app).post('/api/tasks').send({ title: 'Task 2' });
      const task3 = await request(app).post('/api/tasks').send({ title: 'Task 3' });

      // Mark one as completed
      await request(app).post(`/api/tasks/${task3.body.id}/done`);

      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body.every(task => !task.completed)).toBe(true);
    });

    it('should return maximum 5 most recent tasks', async () => {
      // Create 7 tasks
      for (let i = 1; i <= 7; i++) {
        await request(app).post('/api/tasks').send({ title: `Task ${i}` });
      }

      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body).toHaveLength(5);
    });

    it('should return tasks in descending order by created_at', async () => {
      await request(app).post('/api/tasks').send({ title: 'First' });
      await new Promise(resolve => setTimeout(resolve, 10));
      await request(app).post('/api/tasks').send({ title: 'Second' });
      await new Promise(resolve => setTimeout(resolve, 10));
      await request(app).post('/api/tasks').send({ title: 'Third' });

      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body[0].title).toBe('Third');
      expect(response.body[1].title).toBe('Second');
      expect(response.body[2].title).toBe('First');
    });
  });

  describe('POST /api/tasks/:id/done', () => {
    let taskId;

    beforeEach(async () => {
      await db.query('DELETE FROM "task"');
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Test task' });
      taskId = response.body.id;
    });

    it('should mark a task as completed', async () => {
      const response = await request(app)
        .post(`/api/tasks/${taskId}/done`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.task).toHaveProperty('id', taskId);

      // Verify task is not in the list anymore
      const listResponse = await request(app).get('/api/tasks');
      expect(listResponse.body.find(t => t.id === taskId)).toBeUndefined();
    });

    it('should return 404 for non-existent task', async () => {
      await request(app)
        .post('/api/tasks/99999/done')
        .expect(404);
    });

    it('should return 400 for invalid id', async () => {
      await request(app)
        .post('/api/tasks/invalid/done')
        .expect(400);
    });

    it('should return 404 when marking already completed task', async () => {
      // Mark as done first time
      await request(app).post(`/api/tasks/${taskId}/done`).expect(200);

      // Try to mark again
      await request(app)
        .post(`/api/tasks/${taskId}/done`)
        .expect(404);
    });

    it('should set completed_at timestamp', async () => {
      await request(app).post(`/api/tasks/${taskId}/done`);

      const result = await db.query(
        'SELECT completed, completed_at FROM "task" WHERE id = $1',
        [taskId]
      );

      expect(result.rows[0].completed).toBe(true);
      expect(result.rows[0].completed_at).not.toBeNull();
    });
  });

  describe('Health check', () => {
    it('should return ok status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toEqual({ ok: true });
    });
  });

  describe('CORS', () => {
    it('should have CORS headers enabled', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });
});
