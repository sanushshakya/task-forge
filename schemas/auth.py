// app/api/auth/schemas.ts

import { BaseModel } from 'pydantic';
import { EmailStr, validator } from 'pydantic';

/**
 * Pydantic model for login request.
 */
export class LoginRequest extends BaseModel {
  @validator('email')
  static validateEmail(v: string): EmailStr {
    return EmailStr.validate(v);
  }

  email: EmailStr;
  password: string;
}

/**
 * Pydantic model for register request.
 */
export class RegisterRequest extends BaseModel {
  username: string;
  email: EmailStr;

  @validator('email')
  static validateEmail(v: string): EmailStr {
    return EmailStr.validate(v);
  }

  password: string;
}

/**
 * Pydantic model for token response.
 */
export class TokenResponse extends BaseModel {
  access_token: string;
  token_type: string;
}