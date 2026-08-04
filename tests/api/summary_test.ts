// tests/api/summary_test.ts

import request from 'supertest';
import app from '@/app';

describe('API /api/summary', () => {
  it('should generate a summary for entries using the Ollama API', async () => {
    // Mock the Ollama API response
    const mockOllamaResponse = { data: 'Mock summary data' };
    jest.spyOn(axios, 'post').mockResolvedValue(mockOllamaResponse);

    // Send a request to the summary route
    const res = await request(app)
      .post('/api/summary')
      .send({ entries: [] });

    // Check the response status code and body
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockOllamaResponse.data);
  });

  it('should return an error if the Ollama API request fails', async () => {
    // Mock a failed Ollama API request
    jest.spyOn(axios, 'post').mockRejectedValue(new Error('API error'));

    // Send a request to the summary route
    const res = await request(app)
      .post('/api/summary')
      .send({ entries: [] });

    // Check the response status code and body
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Failed to generate summary' });
  });
});