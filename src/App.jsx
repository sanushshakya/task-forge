// src/components/BillingStatus.tsx

import React, { useState, useEffect } from 'react';

const BillingStatus: React.FC = () => {
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the team's current plan and status from the API
    fetch('/api/billing/status')
      .then((response) => response.json())
      .then((data) => {
        if (data.plan === 'free') {
          setStatus('Free Plan');
        } else if (data.plan === 'pro') {
          setStatus('Pro Plan');
        }
      })
      .catch((error) => {
        console.error('Error fetching billing status:', error);
        setStatus(null);
      });
  }, []);

  const handleCheckout = () => {
    // POST to /api/billing/checkout if the plan is free
    if (status === 'Free Plan') {
      fetch('/api/billing/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        if (!response.ok) {
          alert('Failed to initiate checkout.');
        }
      });
    } else if (status === 'Pro Plan') {
      // POST to /api/billing/portal if the plan is pro
      fetch('/api/billing/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        if (!response.ok) {
          alert('Failed to redirect to billing portal.');
        }
      });
    }
  };

  return (
    <div>
      {status ? (
        <div>
          <h2>Billing Status</h2>
          <p>{status}</p>
          <button onClick={handleCheckout}>Upgrade/Manage Plan</button>
        </div>
      ) : (
        <p>Loading billing status...</p>
      )}
    </div>
  );
};

export default BillingStatus;
```

```typescript
// src/App.jsx

import React from 'react';
import EntryForm from './components/EntryForm';
import BillingStatus from './components/BillingStatus';

const App: React.FC = () => {
  return (
    <div>
      <h1>Task Tracker</h1>
      <EntryForm />
      <BillingStatus />
    </div>
  );
};

export default App;