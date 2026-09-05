// app/pricing/page.tsx

import React from 'react';
import { useRouter } from 'next/router';

/**
 * PricingPage component displays pricing information for Free and Pro plans.
 * It includes a list of features for each plan and a "Get Started" button for the Pro plan.
 */
const PricingPage: React.FC = () => {
  const router = useRouter();
  
  /**
   * Handles the click event on the "Get Started" button for the Pro plan.
   * Sends a POST request to /api/billing/checkout with the priceId from env NEXT_PUBLIC_STRIPE_PRICE_ID
   */
  const handleProPlanClick = async () => {
    try {
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(data.url);
      } else {
        console.error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error during checkout process:', error);
    }
  };

  return (
    <div className="pricing-page">
      <h1>Pricing</h1>
      <section className="free-plan">
        <h2>Free Plan</h2>
        <ul>
          <li>Basic features</li>
          <li>Limited storage</li>
          <li>No priority support</li>
        </ul>
      </section>
      <section className="pro-plan">
        <h2>Pro Plan</h2>
        <ul>
          <li>All Free plan features</li>
          <li>Unlimited storage</li>
          <li>Priority support</li>
          <li>Advanced analytics</li>
          <li>Custom branding options</li>
        </ul>
        <button className="get-started-button" onClick={handleProPlanClick}>Get Started</button>
      </section>
    </div>
  );
};

export default PricingPage;