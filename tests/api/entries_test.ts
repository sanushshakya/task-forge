// tests/api/entries_test.ts

import { describe, it, expect } from '@jest/globals';
import supertest from 'supertest';
import app from '../../src/app'; // Adjust the path according to your project structure

describe('GET /api/entries', () => {
  let server;

  beforeAll(async () => {
    server = await app.listen(3001); // Start the server on a different port for testing
  });

  afterAll(async () => {
    await server.close(); // Close the server after all tests are done
  });

  it('should return entries for authenticated user', async () => {
    const response = await supertest(server)
      .get('/api/entries')
      .set('Authorization', 'Bearer your.jwt.token.here');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should filter entries by date range when provided', async () => {
    const startDate = '2023-01-01T00:00:00Z';
    const endDate = '2023-12-31T23:59:59Z';

    const response = await supertest(server)
      .get('/api/entries?startDate=' + startDate + '&endDate=' + endDate)
      .set('Authorization', 'Bearer your.jwt.token.here');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should sort entries by date descending when provided', async () => {
    const response = await supertest(server)
      .get('/api/entries?sort=desc')
      .set('Authorization', 'Bearer your.jwt.token.here');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    // Assuming the entries are sorted by date in descending order
    for (let i = 1; i < response.body.length; i++) {
      expect(new Date(response.body[i - 1].date)).toBeGreaterThanOrEqual(new Date(response.body[i].date));
    }
  });

  it('should return an empty array if no entries are found', async () => {
    const response = await supertest(server)
      .get('/api/entries?startDate=9999-01-01T00:00:00Z&endDate=9999-12-31T23:59:59Z')
      .set('Authorization', 'Bearer your.jwt.token.here');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });
});