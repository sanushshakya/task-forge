// models/index.ts

/**
 * This module exports all models used in the application.
 */

import { Team } from './Team';
import { Subscription } from './Subscription';

export {
  Team,
  Subscription,
};
```

```typescript
// models/Subscription.ts

/**
 * Represents a subscription associated with a user.
 */
export interface Subscription {
  /**
   * The unique identifier for the subscription.
   */
  _id: string;

  /**
   * Reference to the user associated with the subscription.
   */
  userId: string;

  /**
   * The type of the subscription (e.g., "basic", "premium").
   */
  type: string;

  /**
   * Indicates whether the subscription is active.
   */
  isActive: boolean;

  /**
   * The date when the subscription was created.
   */
  createdAt: Date;
}