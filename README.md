import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

// Define environment variable schema using Zod for validation
const envSchema = z.object({
  MONGODB_URI: z.string().url(),
  JWT_SECRET: z.string().min(32),
  OLLAMA_URL: z.string().url().default('http://localhost:11434'),
});

// Function to validate environment variables at startup
function validateEnv(): void {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    throw new Error(`Missing or invalid environment variables: ${JSON.stringify(result.error.format())}`);
  }
}

validateEnv();

// Document auth endpoints in README.md