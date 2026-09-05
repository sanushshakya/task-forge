// app/api/billing/checkout/route.ts

import { Request, Response } from 'fastapi';
import Stripe from 'stripe';
import { getAuthenticatedUserId } from '../middleware/auth';

const stripe = new Stripe('your_stripe_secret_key', {
  apiVersion: '2023-08-16',
});

/**
 * Creates a Stripe Checkout session for billing.
 *
 * @param req - The request object containing the user's ID and subscription details.
 * @param res - The response object to send back the session URL.
 */
export async function createCheckoutRoute(req: Request, res: Response) {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Retrieve subscription details from request body
    const { planId } = req.body;

    // Check if the user has a valid subscription plan
    if (!planId) {
      return res.status(400).json({ error: 'Plan ID is required' });
    }

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Pro Plan', // Assuming 'Pro Plan' is the name of the subscription plan
            },
            unit_amount: 2000, // Assuming $20 per month for the Pro Plan
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,
      customer_email: req.body.email, // Assuming email is provided in the request body
    });

    return res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating Stripe Checkout session:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}