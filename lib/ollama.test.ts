// lib/ollama.ts

/**
 * Ollama API client for sending requests and handling responses.
 */
import axios from 'axios';

/**
 * Generates text using the Ollama API.
 * @param prompt - The input prompt to generate text from.
 * @param model - The model to use for generation, defaults to "qwen2.5-coder:7b".
 * @returns A Promise resolving to the generated text or a fallback string on error.
 */
export async function generateText(prompt: string, model = "qwen2.5-coder:7b"): Promise<string> {
  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      prompt,
      stream: false
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data.response;
  } catch (error) {
    console.error('Error generating text:', error);
    return "An error occurred while generating text.";
  }
}