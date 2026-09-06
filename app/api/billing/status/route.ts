import express from 'express';
import { Subscription } from '../../models/Subscription';

const router = express.Router();

/**
 * Route handler for retrieving billing status.
 *
 * @name GET /api/billing/status
 * @description Retrieves the current billing status for the authenticated user.
 * @returns {Object} - The billing status, including subscription details and payment method information.
 */
router.get('/status', async (req, res) => {
  try {
    const userId = req.user.id; // Assuming authentication middleware sets the user ID on the request object
    const subscription = await Subscription.findOne({ userId });

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    return res.status(200).json(subscription);
  } catch (error) {
    console.error('Error retrieving billing status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;