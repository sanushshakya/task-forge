// app/api/billing/portal/route.ts

import { Request, Response } from 'express';
import Stripe from 'stripe';
import { authMiddleware } from '../../api/middleware/auth';
import { getUserById, getTeamByUserId } from '../../auth/dependencies';

/**
 * Route handler for generating and returning a Stripe billing portal URL.
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
});

export const getBillingPortalUrl = async (req: Request, res: Response) => {
  try {
    // Ensure the user is authenticated
    const userId = await authMiddleware(req);

    // Retrieve user details from the database
    const user = await getUserById(userId);
    if (!user || !user.email) {
      return res.status(400).json({ error: 'User email not found' });
    }

    // Get the team associated with the user
    const team = await getTeamByUserId(userId);
    if (!team || !team.stripeCustomerId) {
      return res.status(400).json({ error: 'Team or Stripe customer ID not found' });
    }

    // Create a session for the billing portal
    const session = await stripe.billingPortal.sessions.create({
      customer: team.stripeCustomerId, // Use the team's Stripe customer ID
      return_url: `${process.env.FRONTEND_URL}/billing`, // Updated return URL to /billing
    });

    // Return the session URL to the client
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error generating billing portal URL:', error);
    res.status(500).json({ error: 'Failed to generate billing portal URL' });
  }
};

// Export the route handler for use in the Express application
export default getBillingPortalUrl;