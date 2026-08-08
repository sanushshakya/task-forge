import axios from 'axios';

/**
 * Ollama API client for sending requests and handling responses.
 */
export class OllamaClient {
  private readonly apiUrl: string;

  /**
   * Constructor to initialize the Ollama API client.
   * @param apiUrl - The base URL of the Ollama API.
   */
  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  /**
   * Sends a prompt to the Ollama API and handles the response.
   * @param prompt - The text prompt to send to the API.
   * @returns A Promise resolving with the API response or rejecting with an error.
   */
  async sendPrompt(prompt: string): Promise<any> {
    try {
      const response = await axios.post(this.apiUrl, { prompt });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Ollama API error: ${error.response?.data}`);
      }
      throw new Error('Failed to send prompt to Ollama API');
    }
  }
}