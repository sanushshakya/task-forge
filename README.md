## New Feature

- **POST `/api/entries`**

#### Description
This endpoint allows users to create new entries. It first validates the request body using a Zod schema defined in `lib/validation.ts`. If the data is invalid, it returns a 400 error with the validation errors. Otherwise, it proceeds to create the entry.

**Rate Limiting:**
- This route is rate-limited to prevent abuse. Each user can make up to 10 requests per minute.

#### Request Body
```json
{
  "mood": 3,
  "notes": "I had a good day today."
}
```

#### Response on Success
```json
{
  "message": "User created successfully"
}
```

#### Response on Validation Error
```json
{
  "issues": [
    {
      "path": ["mood"],
      "code": "invalid_type",
      "expected": "number",
      "received": "string",
      "message": "Expected number, received string"
    }
  ]
}
```

#### Response on Conflict (Email already exists)
```json
{
  "message": "Email already in use"
}
```
--- END ---


--- ARCHITECTURE PROFILE ---
Language        : TypeScript
Other languages : Python, JavaScript
Framework       : FastAPI
Other frameworks: Express
Arch pattern    : monolith/MVC
API style       : REST
Databases       : MongoDB
ORM / ODM       : Mongoose
Cache / broker  : none
Auth method     : JWT
Test framework  : pytest
Docker          : no
Kubernetes      : no
Naming style    : camelCase
Type hints      : yes
Multi-tenancy   : no
RBAC            : no
Repository pat. : no
Service layer   : no
API versioning  : no
Event sourcing  : no
Feature flags   : no
Entry points    : none

Key modules (path → purpose):
  app/api/auth/me/route.ts                      * Route handler for retrieving the authenticated user's ID.
  app/api/auth/signup/route.ts                  * Handles user signup requests.
  app/api/entries/route.ts                      * Handles entry retrieval requests for authenticated users, optionally filtering
  app/api/summary/controller.ts                 app/api/summary/controller.ts
  app/api/summary/route.ts                      * Route handler for generating entry summaries using the Ollama API.
  app/api/summary/types.ts                      * Interface representing the request body for generating an entry summary.
  auth/dependencies.py                          Dependency for decoding a JWT token and returning the current user.
  auth/jwt_handler.py                           * JWT Handler for encoding and decoding JWT tokens with expiration.
  auth/password.py                              * Utility functions for password handling using bcrypt.
  lib/auth/types.ts                             * Define TypeScript types for JWT token and user ID.
  lib/auth.ts                                   * Helper functions for handling authentication-related tasks.
  lib/mongodb.ts                                * Get a cached MongoDB connection using mongoose.
  lib/ollama.ts                                 * Ollama API client for sending requests and handling responses.
  lib/streak.test.ts                            lib/streak.test.ts
  lib/streak.ts                                 * Calculates the current consecutive-day streak counting backward from today bas
  lib/validation.ts                             * Entry schema and validation helper using Zod.
  models/Entry.ts                               * Define a Mongoose schema for the Entry model.
  routes/auth.py                                * Auth routes for handling user authentication.
  routes/users.py                               * Handles user login requests.
  schemas/auth.py                               * Auth schemas for login and registration requests and token responses.
  src/app.js                                    * @file src/app.js
  src/feature.py                                * Route handler for creating a new entry.
  src/routes/index.js                           * @file src/routes/index.js
  src/server.js                                 * @file src/server.js
  tests/api/entries_test.ts                     tests/api/entries_test.ts

Dependencies (7): cors, dotenv, express, helmet, mongoose, morgan, zod
--- END PROFILE ---
Match the naming convention, import style, type hints, ORM, auth method, and patterns shown above.

Other project files:
=== app/api/auth/logout/route.ts ===
import { FastAPI } from 'fastapi';
import { HTTPException } from 'fastapi.exceptions';
import { Depends, Request } from 'fastapi.types';
import { CookieParams, Response as FastAPIResponse } from 'httpx';
import jwt from 'jsonwebtoken';

// Import custom dependencies
import decodeToken from '@/auth/dependencies.py';

const app = new FastAPI();

/**
 * Route handler for logging out a user by clearing the JWT cookie.
 * @param request - The incoming HTTP request.
 * @returns A response indicating success or failure.
 */
export async function POST(request: Request) {
  try {
    // Extract the token from the authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HTTPException(401, 'Unauthorized');
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET as string);

    // Clear the JWT cookie
    const response = new FastAPIResponse({ message: 'Logged out successfully' });
    response.cookies.set('jwt', '', { expires: new Date(0) });
    return response;
  } catch (error) {
    throw new HTTPException(401, 'Unauthorized');
  }
}

=== app/api/auth/me/route.ts ===
import { FastAPI } from 'fastapi';
import { Depends, Request } from 'fastapi.types';
import decodeToken from '@/auth/dependencies.py';

const app = new FastAPI();

/**
 * Route handler for retrieving the authenticated user's ID.
 * @param request - The incoming HTTP request.
 * @returns A JSON response containing the authenticated user's ID or a 401 error if not authenticated.
 */
export async function GET(request: Request) {
  try {
    // Extract the token from the authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HTTPException(401, 'Unauthorized');
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = decodeToken(token);
    return JSON.stringify({ userId: decodedToken.userId });
  } catch (error) {
    throw new HTTPException(401, 'Unauthorized');
  }
}

=== app/api/auth/signup/route.ts ===
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import rateLimit from '@/lib/rate-limit'; // Import the rate limiting middleware

/**
 * Handles user signup requests.
 * @param request - The incoming request object.
 * @returns A response indicating success or failure.
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password, mood, notes } = await request.json();

    // Apply rate limit to the signup endpoint
    const userIP = request.headers.get('x-forwarded-for') || request.ip;
    if (await rateLimit(userIP)) {
      return new NextResponse(JSON.stringify({ message: 'Too many requests. Please try again later.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate the entry data using the Zod schema
    const validationError = validateEntry({
      mood,
      notes,
    });

    if (validationError) {
      return new NextResponse(JSON.stringify(validationError.issues), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return new NextResponse(JSON.stringify({ message: 'Email already in use' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
      mood,
      notes,
    });

    await newUser.save();

    return NextResponse.json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}