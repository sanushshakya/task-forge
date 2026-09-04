// components/SyncOnReconnect.tsx

import React, { useEffect } from 'react';

/**
 * SyncOnReconnect component to sync queued entries on browser reconnect.
 */
const SyncOnReconnect: React.FC = () => {
  useEffect(() => {
    const handleOnline = async () => {
      // Function to fetch the user's ID using JWT token
      const fetchUserId = async (): Promise<string | null> => {
        try {
          const response = await fetch('/api/auth/me');
          if (response.ok) {
            const data = await response.json();
            return data.userId;
          }
          return null;
        } catch (error) {
          console.error('Error fetching user ID:', error);
          return null;
        }
      };

      // Function to sync queued entries
      const syncEntries = async (userId: string): Promise<void> => {
        try {
          await fetch('/api/entries/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
          });
          console.log('Sync completed successfully.');
        } catch (error) {
          console.error('Error syncing entries:', error);
        }
      };

      const userId = await fetchUserId();
      if (userId) {
        syncEntries(userId);
      }
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return null;
};

export default SyncOnReconnect;