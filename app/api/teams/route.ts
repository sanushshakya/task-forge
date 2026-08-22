// app/api/teams/route.ts

import { FastAPI, Request, Response, HTTPException } from 'fastapi';
import { Team } from '../../models';
import { createTeam } from '../teams.service';
import { verifyToken } from '../../../auth/dependencies'; // Import the JWT verification function

/**
 * @swagger
 * /teams:
 *   post:
 *     summary: Create a new team with authentication
 *     description: Creates a new team with the provided details, requiring a valid JWT token for authorization.
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
 *       '401':
 *         description: Unauthorized, JWT token is missing or invalid
 *       '500':
 *         description: Internal server error
 */
export default function (app: FastAPI) {
  app.post('/teams', async (request: Request, response: Response) => {
    try {
      const authorizationHeader = request.headers.get('Authorization');
      if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        throw new HTTPException(401, 'Unauthorized, JWT token is missing or invalid');
      }
      const token = authorizationHeader.split(' ')[1];
      const userId = await verifyToken(token); // Verify the JWT token to get the user ID

      const teamData = await request.json();
      if (!teamData || !teamData.name) {
        throw new HTTPException(400, 'Bad request, invalid team data provided');
      }
      teamData.createdBy = userId; // Add the createdBy field with the authenticated user's ID

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