// lib/ollama.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Ollama API client for sending requests and handling responses.
 */
export class OllamaClient {
  private axios: AxiosInstance;

  /**
   * Creates an instance of the OllamaClient.
   * @param apiKey - The API key for authenticating requests to the Ollama API.
   */
  constructor(private apiKey: string) {
    this.axios = axios.create({
      baseURL: 'https://api.ollama.com',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Sends a request to the Ollama API and returns the response.
   * @param endpoint - The API endpoint to send the request to.
   * @param method - The HTTP method to use (e.g., GET, POST).
   * @param data - The data to send with the request (for methods like POST or PUT).
   * @returns The AxiosResponse object containing the response from the Ollama API.
   */
  public async sendRequest<T = any>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: any
  ): Promise<AxiosResponse<T>> {
    const config: AxiosRequestConfig = { method, url: endpoint };

    if (data) {
      config.data = data;
    }

    try {
      return await this.axios.request(config);
    } catch (error) {
      throw new Error(`Ollama API request failed: ${error.message}`);
    }
  }

  /**
   * Generates an entry summary using the Ollama API.
   * @param prompt - The text prompt to generate a summary for.
   * @returns A Promise that resolves with the generated summary.
   */
  public async generateEntrySummary(prompt: string): Promise<string> {
    const response = await this.sendRequest<{ summary: string }>('/summarize', 'POST', { prompt });
    return response.data.summary;
  }
}
```

### Explanation

1. **Class Definition**: The `OllamaClient` class is defined to encapsulate the functionality for interacting with the Ollama API.
2. **Constructor**: Initializes an Axios instance with the base URL and authorization header.
3. **sendRequest Method**: A generic method to send requests to the Ollama API. It takes the endpoint, HTTP method, and optional data as parameters. It uses the Axios instance to make the request and handles any errors that might occur during the request.
4. **generateEntrySummary Method**: A specific method to generate an entry summary using the `/summarize` endpoint of the Ollama API. It sends a POST request with a text prompt and returns the generated summary from the response.

This setup ensures that all interactions with the Ollama API are centralized within the `OllamaClient` class, making it easy to manage and test.