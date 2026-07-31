/**
 * Auth schemas for login and registration requests and token responses.
 * @module schemas/auth
 */

import { Schema } from 'mongoose';

/**
 * Pydantic schema for login request.
 */
export const LoginRequest = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' }
  },
  required: ['email', 'password'],
  additionalProperties: false
} as Schema;

/**
 * Pydantic schema for registration request.
 */
export const RegisterRequest = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' }
  },
  required: ['email', 'password'],
  additionalProperties: false
} as Schema;

/**
 * Pydantic schema for token response.
 */
export const TokenResponse = {
  type: 'object',
  properties: {
    accessToken: { type: 'string' }
  },
  required: ['accessToken'],
  additionalProperties: false
} as Schema;