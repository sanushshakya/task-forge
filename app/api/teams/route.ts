// app/api/teams/route.ts

import { FastAPI, Request, Response, HTTPException } from 'fastapi';
import { Team } from '../../models';
import { createTeam } from '../teams.service';

/**
 * @swagger
 * /teams:
 *   post:
 *     summary: Create a new team
 *     description: Creates a new team with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Team'
 *     responses:
 *       '201':
 *         description: Team created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 *       '400':
 *         description: Bad request, invalid team data provided
 *       '500':
 *         description: Internal server error
 */
export default function (app: FastAPI) {
  app.post('/teams', async (request: Request, response: Response) => {
    try {
      const teamData = await request.json();
      const team = await createTeam(teamData);
      return response.status(201).json(team);
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error;
      }
      throw new HTTPException(500, 'Internal Server Error');
    }
  });
}