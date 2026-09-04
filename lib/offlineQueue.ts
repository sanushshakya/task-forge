/**
 * This module provides functionality for managing an offline queue using localStorage to store failed POST requests.
 */

import { User } from '../models/User';

// Key used in localStorage to store the offline queue
const OFFLINE_QUEUE_KEY = 'offlineQueue';

/**
 * Adds a failed POST request to the offline queue.
 * @param url - The URL of the failed request.
 * @param method - The HTTP method (e.g., 'POST').
 * @param body - The request body as JSON string.
 */
export function addToOfflineQueue(url: string, method: string, body: any): void {
  const queue = getOfflineQueue();
  queue.push({ url, method, body });
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
}

/**
 * Retrieves the offline queue from localStorage.
 * @returns An array of failed POST requests.
 */
function getOfflineQueue(): { url: string; method: string; body: any }[] {
  const queue = localStorage.getItem(OFFLINE_QUEUE_KEY);
  return queue ? JSON.parse(queue) : [];
}

/**
 * Tries to resend all failed POST requests in the offline queue.
 * @returns A promise that resolves when all requests have been attempted.
 */
export async function processOfflineQueue(): Promise<void> {
  const queue = getOfflineQueue();
  for (const item of queue) {
    try {
      await sendRequest(item.url, item.method, JSON.parse(item.body));
      // If the request is successful, remove it from the queue
      removeFromOfflineQueue(item);
    } catch (error) {
      console.error('Failed to resend request:', error);
    }
  }
}

/**
 * Removes a failed POST request from the offline queue.
 * @param item - The item to be removed from the queue.
 */
function removeFromOfflineQueue(item: { url: string; method: string; body: any }): void {
  const queue = getOfflineQueue();
  const index = queue.findIndex(q => q.url === item.url && q.method === item.method && q.body === JSON.stringify(item.body));
  if (index !== -1) {
    queue.splice(index, 1);
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  }
}

/**
 * Sends a POST request to the specified URL with the given method and body.
 * @param url - The URL to send the request to.
 * @param method - The HTTP method (e.g., 'POST').
 * @param body - The request body as an object.
 * @returns A promise that resolves when the request has been sent.
 */
async function sendRequest(url: string, method: string, body: any): Promise<void> {
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Failed to send request: ${response.statusText}`);
  }
}