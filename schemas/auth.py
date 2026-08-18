import { z } from 'zod';

// Define environment variables using Zod
export const envSchema = z.object({
  MONGODB_URI: z.string().url(),
  JWT_SECRET: z.string().min(32),
  OLLAMA_URL: z.string().url().default('http://localhost:11434'),
});

const envResult = envSchema.safeParse(process.env);

if (!envResult.success) {
  const missingVars = envResult.error.issues.map((issue) => issue.path.join('.')).join(', ');
  throw new Error(`Missing environment variables: ${missingVars}`);
}

export const { MONGODB_URI, JWT_SECRET, OLLAMA_URL } = envResult.data;

// auth/schemas/auth.py

import { BaseModel } from 'pydantic';

class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str