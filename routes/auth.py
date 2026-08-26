// routes/auth.ts

import { Router } from 'fastapi';
import { HTTPException, Depends } from 'fastapi';
import * as authDependencies from '../auth/dependencies';

const router = new Router();

/**
 * Route handler for user registration.
 */
router.post('/register', async (request: Request) => {
  const userData = request.json();
  // Validate and create the user
  return await authDependencies.createUser(userData);
});

/**
 * Route handler for user login.
 */
router.post('/login', async (request: Request) => {
  const credentials = request.json();
  // Authenticate the user and return a JWT token
  return await authDependencies.authenticateUser(credentials.username, credentials.password);
});

/**
 * Route handler for forgot password.
 */
router.post('/forgot-password', async (request: Request) => {
  const email = request.json().email;
  // Send a password reset email
  return await authDependencies.sendPasswordResetEmail(email);
});

export default router;