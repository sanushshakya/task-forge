import { z } from 'zod';

// Define Pydantic-like schemas using Zod for validation

/**
 * Schema for login requests.
 */
export const LoginRequest = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

/**
 * Schema for registration requests.
 */
export const RegisterRequest = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

/**
 * Schema for token responses.
 */
export const TokenResponse = z.object({
  access_token: z.string(),
  token_type: z.literal('bearer'),
});