// app/api/teams/[id]/route.ts

import { FastAPI, HTTPException, Request, Response } from 'fastapi';
import { Depends, Get, Patch, Post, Query, Path } from 'fastapi.types';
import { decodeToken } from '@/auth/dependencies.py';
import { Team } from '@/models/index.ts';

const app = new FastAPI();

/**
 * Middleware to ensure the routes only process requests for authenticated users.
 * @param request - The incoming HTTP request.
 * @param call_next - The next middleware or route
 */
async function authMiddleware(request: Request, call_next) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    throw new HTTPException(401, 'Unauthorized');
  }
  try {
    const userId = await decodeToken(token);
    request.state.userId = userId;
    return await call_next(request);
  } catch (error) {
    throw new HTTPException(401, 'Invalid token');
  }
}

/**
 * Route handler for retrieving a team by ID.
 * @param id - The ID of the team to retrieve.
 * @returns The retrieved team.
 */
app.get('/api/teams/{id}', [authMiddleware], async (request: Request) => {
  const { id } = request.pathParams;
  try {
    const team = await Team.findById(id);
    if (!team) {
      throw new HTTPException(404, 'Team not found');
    }
    return team;
  } catch (error) {
    throw new HTTPException(500, 'Internal server error');
  }
});

/**
 * Route handler for updating a team by ID.
 * @param id - The ID of the team to update.
 * @param data - The updated team data.
 * @returns The updated team.
 */
app.patch('/api/teams/{id}', [authMiddleware], async (request: Request, data: Partial<Team>) => {
  const { id } = request.pathParams;
  try {
    const team = await Team.findByIdAndUpdate(id, data, { new: true });
    if (!team) {
      throw new HTTPException(404, 'Team not found');
    }
    return team;
  } catch (error) {
    throw new HTTPException(500, 'Internal server error');
  }
});

/**
 * Route handler for creating a new team.
 * @param data - The data for the new team.
 * @returns The newly created team.
 */
app.post('/api/teams', [authMiddleware], async (request: Request, data: Partial<Team>) => {
  const userId = request.state.userId;
  try {
    const team = await Team.create({ ...data, ownerId: userId });
    return team;
  } catch (error) {
    throw new HTTPException(500, 'Internal server error');
  }
});