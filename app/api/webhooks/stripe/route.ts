// app/api/webhooks/stripe/route.ts

import express from 'express';
import { body, validationResult } from 'express-validator';
import Stripe from 'stripe';
import { Subscription } from '../../models/Subscription';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2020-08-27',
});

const router = express.Router();

/**
 * Handle incoming Stripe webhook events.
 *
 * @route POST /api/webhooks/stripe
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
router.post(
  '/',
  [
    body('type').not().isEmpty(),
    body('data.object.id').not().isEmpty(),
    body('data.object.status').not().isEmpty(),
  ],
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, data } = req.body;
    const { id: subscriptionId, status } = data.object;

    // Verify the Stripe webhook signature
    const sigHeader = req.headers['stripe-signature'];
    if (!sigHeader) {
      return res.status(400).json({ message: 'Missing Stripe signature header' });
    }

    try {
      stripe.webhooks.constructEvent(
        JSON.stringify(req.body),
        sigHeader,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch (error) {
      console.error('Stripe webhook signature verification failed:', error);
      return res.status(400).json({ message: 'Invalid Stripe signature' });
    }

    try {
      let subscription = await Subscription.findById(subscriptionId);

      if (!subscription) {
        return res.status(404).json({ message: 'Subscription not found' });
      }

      switch (type) {
        case 'invoice.payment_succeeded':
          // Update subscription status to active
          subscription.active = true;
          break;

        case 'invoice.payment_failed':
          // Update subscription status to inactive
          subscription.active = false;
          break;

        default:
          return res.status(400).json({ message: 'Unsupported event type' });
      }

      await subscription.save();

      return res.status(200).json({ message: 'Subscription updated successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;