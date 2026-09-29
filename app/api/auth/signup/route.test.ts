// app/api/auth/signup/route.test.ts

import { describe, it, expect } from 'vitest';
import z from 'zod';

const passwordSchema = z.string().min(8).regex(/^(?=.*[a-zA-Z])(?=.*\d)/);

describe('Password Validation', () => {
  it('should allow valid passwords', async () => {
    const validPasswords = [
      'password1',
      'Passw0rd!',
      '12345678',
      'AaBbCcDd',
    ];

    for (const password of validPasswords) {
      expect(passwordSchema.safeParse(password).success).toBe(true);
    }
  });

  it('should reject passwords with less than 8 characters', async () => {
    const shortPassword = 'pass1';
    expect(passwordSchema.safeParse(shortPassword).success).toBe(false);
  });

  it('should reject passwords without any letters', async () => {
    const noLetterPassword = '12345678';
    expect(passwordSchema.safeParse(noLetterPassword).success).toBe(false);
  });

  it('should reject passwords without any numbers', async () => {
    const noNumberPassword = 'password';
    expect(passwordSchema.safeParse(noNumberPassword).success).toBe(false);
  });
});