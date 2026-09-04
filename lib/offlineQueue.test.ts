// lib/offlineQueue.test.ts

import { describe, it, expect } from '@jest/globals';
import * as offlineQueueModule from './offlineQueue';

describe('Offline Queue', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('enqueueRequest', () => {
    it('should enqueue a POST request with the correct URL and data', async () => {
      const url = '/api/entries';
      const method = 'POST';
      const data = { title: 'Test Entry', content: 'This is a test entry.' };

      await offlineQueueModule.enqueueRequest(url, method, data);

      const queueItem = JSON.parse(localStorage.getItem('offlineQueue') || '[]')[0];
      expect(queueItem.url).toBe(url);
      expect(queueItem.method).toBe(method);
      expect(queueItem.data).toEqual(data);
    });

    it('should enqueue multiple requests in the correct order', async () => {
      const request1 = { url: '/api/entries', method: 'POST', data: { title: 'Entry 1' } };
      const request2 = { url: '/api/entries/1', method: 'PUT', data: { content: 'Updated Entry 1' } };

      await offlineQueueModule.enqueueRequest(request1.url, request1.method, request1.data);
      await offlineQueueModule.enqueueRequest(request2.url, request2.method, request2.data);

      const queueItems = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
      expect(queueItems.length).toBe(2);
      expect(queueItems[0]).toEqual(request1);
      expect(queueItems[1]).toEqual(request2);
    });
  });

  describe('processQueue', () => {
    it('should process all queued requests and clear the queue', async () => {
      const request1 = { url: '/api/entries', method: 'POST', data: { title: 'Entry 1' } };
      const request2 = { url: '/api/entries/1', method: 'PUT', data: { content: 'Updated Entry 1' } };

      await offlineQueueModule.enqueueRequest(request1.url, request1.method, request1.data);
      await offlineQueueModule.enqueueRequest(request2.url, request2.method, request2.data);

      await offlineQueueModule.processQueue();

      const queueItems = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
      expect(queueItems.length).toBe(0);
    });

    it('should handle errors during request processing', async () => {
      jest.spyOn(offlineQueueModule, 'processRequest').mockRejectedValue(new Error('Simulated error'));

      const request = { url: '/api/entries', method: 'POST', data: { title: 'Entry 1' } };
      await offlineQueueModule.enqueueRequest(request.url, request.method, request.data);

      await expect(offlineQueueModule.processQueue()).rejects.toThrowError('Simulated error');

      const queueItems = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
      expect(queueItems.length).toBe(1);
    });
  });

  describe('processRequest', () => {
    it('should handle a successful POST request', async () => {
      const url = '/api/entries';
      const method = 'POST';
      const data = { title: 'Test Entry', content: 'This is a test entry.' };

      const responseMock = jest.fn().mockResolvedValue({ status: 201, data: {} });

      (offlineQueueModule as any).request = responseMock;

      await offlineQueueModule.processRequest(url, method, data);

      expect(responseMock).toHaveBeenCalledWith(url, { ...data, headers: { 'Content-Type': 'application/json' } });
    });

    it('should handle a failed POST request', async () => {
      const url = '/api/entries';
      const method = 'POST';
      const data = { title: 'Test Entry', content: 'This is a test entry.' };

      const responseMock = jest.fn().mockRejectedValue(new Error('Simulated error'));

      (offlineQueueModule as any).request = responseMock;

      await expect(offlineQueueModule.processRequest(url, method, data)).rejects.toThrowError('Simulated error');
    });
  });
});