// app/api/entries/[id]/route.test.ts

/**
 * Tests for the entries route.
 */

import request from 'supertest';
import { app } from '../../app'; // Adjust the import path as necessary
import mongoose from 'mongoose';

describe('Entries Route', () => {
  let userId: string;
  let teamId: string;

  beforeAll(async () => {
    // Connect to MongoDB (ensure your MongoDB URI is set in an environment variable)
    await mongoose.connect(process.env.MONGODB_URI!);

    // Create a test user
    const user = new app.models.User({
      username: 'testuser',
      email: 'test@example.com',
      isActive: true,
    });
    await user.save();
    userId = user._id.toString();

    // Create a test team
    const team = new app.models.Team({ name: 'Test Team' });
    await team.save();
    teamId = team._id.toString();
  });

  afterAll(async () => {
    // Close MongoDB connection
    await mongoose.connection.close();
  });

  describe('GET /api/entries/:id', () => {
    it('should return a 401 error if the user is not authenticated', async () => {
      const response = await request(app).get('/api/entries/123');
      expect(response.status).toBe(401);
    });

    it('should return the entry for the authenticated user', async () => {
      const token = app.lib.auth.generateToken(userId);
      const response = await request(app)
        .get('/api/entries/123')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/entries/', () => {
    it('should create a new entry for the authenticated user without teamId', async () => {
      const token = app.lib.auth.generateToken(userId);
      const response = await request(app)
        .post('/api/entries/')
        .send({ content: 'Test entry' })
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(201);
    });

    it('should create a new entry for the authenticated user with teamId', async () => {
      const token = app.lib.auth.generateToken(userId);
      const response = await request(app)
        .post('/api/entries/')
        .send({ content: 'Test entry', teamId })
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(201);
    });

    it('should return a 400 error if the teamId is invalid', async () => {
      const token = app.lib.auth.generateToken(userId);
      const response = await request(app)
        .post('/api/entries/')
        .send({ content: 'Test entry', teamId: mongoose.Types.ObjectId().toString() })
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/entries/:id', () => {
    it('should update the entry for the authenticated user without changing teamId', async () => {
      const token = app.lib.auth.generateToken(userId);
      const response = await request(app)
        .put('/api/entries/123')
        .send({ content: 'Updated entry' })
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
    });

    it('should update the entry for the authenticated user with new teamId', async () => {
      const token = app.lib.auth.generateToken(userId);
      const response = await request(app)
        .put('/api/entries/123')
        .send({ content: 'Updated entry', teamId })
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
    });

    it('should return a 400 error if the teamId is invalid', async () => {
      const token = app.lib.auth.generateToken(userId);
      const response = await request(app)
        .put('/api/entries/123')
        .send({ content: 'Updated entry', teamId: mongoose.Types.ObjectId().toString() })
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/entries/:id', () => {
    it('should delete the entry for the authenticated user', async () => {
      const token = app.lib.auth.generateToken(userId);
      const response = await request(app)
        .delete('/api/entries/123')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(204);
    });
  });
});