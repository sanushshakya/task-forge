// app/api/billing/controller.ts

/**
 * Controller for handling all billing-related routes.
 */

import { Request, Response } from 'express';
import Stripe from 'stripe';
import { Subscription } from '@/models/Subscription';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

/**
 * Creates a Stripe Checkout session for billing.
 */
export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Monthly Subscription',
            },
            unit_amount: 2000, // $20
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.BASE_URL}/billing/success`,
      cancel_url: `${process.env.BASE_URL}/billing/cancel`,
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Route handler for generating and returning a Stripe billing portal URL.
 */
export const getBillingPortalUrl = async (req: Request, res: Response) => {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: req.user.stripeCustomerId,
      return_url: `${process.env.BASE_URL}/dashboard`,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Route handler for retrieving billing status.
 */
export const getBillingStatus = async (req: Request, res: Response) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user._id });

    if (!subscription) {
      return res.status(404).json({ message: 'No active subscription found' });
    }

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};