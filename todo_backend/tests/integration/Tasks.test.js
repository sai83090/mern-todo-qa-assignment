const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../../app');
const TodoModel = require('../../models/Todo');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  await TodoModel.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Todo API - Integration', () => {
  describe('POST /add', () => {
    test('should create a task', async () => {
      const res = await request(app).post('/add').send({ task: 'Buy groceries' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.task).toBe('Buy groceries');
    });

    test('negative test: should reject a task with no text', async () => {
      const res = await request(app).post('/add').send({});

      expect(res.statusCode).toBe(400);

      const all = await TodoModel.find();
      expect(all.length).toBe(0);
    });

    test('negative test: should reject a task with empty/whitespace text', async () => {
      const res = await request(app).post('/add').send({ task: '   ' });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /get', () => {
    test('should return all tasks', async () => {
      await TodoModel.create({ task: 'Task 1' });
      await TodoModel.create({ task: 'Task 2' });

      const res = await request(app).get('/get');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });

    test('should return an empty array when no tasks exist', async () => {
      const res = await request(app).get('/get');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('PUT /edit/:id', () => {
    test('should mark a task as done', async () => {
      const todo = await TodoModel.create({ task: 'Task to complete', done: false });

      const res = await request(app).put(`/edit/${todo._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.done).toBe(true);
    });
  });

  describe('PUT /update/:id', () => {
    test('should update the task text', async () => {
      const todo = await TodoModel.create({ task: 'Old text' });

      const res = await request(app)
        .put(`/update/${todo._id}`)
        .send({ task: 'Updated text' });

      expect(res.statusCode).toBe(200);

      const updated = await TodoModel.findById(todo._id);
      expect(updated.task).toBe('Updated text');
    });
  });

  describe('DELETE /delete/:id', () => {
    test('should delete a task', async () => {
      const todo = await TodoModel.create({ task: 'Task to delete' });

      const res = await request(app).delete(`/delete/${todo._id}`);
      expect(res.statusCode).toBe(200);

      const found = await TodoModel.findById(todo._id);
      expect(found).toBeNull();
    });
  });
});