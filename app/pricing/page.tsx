// app/pricing/page.tsx

import React from 'react';

/**
 * PricingPage component displays pricing information for Free and Pro plans.
 * It includes a list of features for each plan and a "Get Started" button for the Pro plan.
 */
const PricingPage: React.FC = () => {
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
        <button className="get-started-button">Get Started</button>
      </section>
    </div>
  );
};

export default PricingPage;