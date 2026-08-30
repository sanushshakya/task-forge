// src/components/BillingStatus.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

/**
 * BillingStatus component fetches and displays the team's current plan and status.
 * It also provides a button to either check out for the Pro Plan or open the billing portal.
 */
const BillingStatus: React.FC = () => {
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch the team's current plan and status from the API
    const fetchBillingStatus = async () => {
      try {
        const response = await axios.get('/api/billing/status');
        setPlan(response.data.plan);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch billing status:', error);
        setLoading(false);
      }
    };

    fetchBillingStatus();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleCheckout = async () => {
    try {
      if (plan === 'Free Plan') {
        await axios.post('/api/billing/checkout');
      } else if (plan === 'Pro Plan') {
        await axios.post('/api/billing/portal');
      }
    } catch (error) {
      console.error('Failed to handle checkout:', error);
    }
  };

  return (
    <div>
      {plan ? <p>Your current plan is: {plan}</p> : <p>No plan information available.</p>}
      <button onClick={handleCheckout} disabled={!plan}>
        {plan === 'Free Plan' ? 'Upgrade to Pro' : 'Open Billing Portal'}
      </button>
    </div>
  );
};

export default BillingStatus;