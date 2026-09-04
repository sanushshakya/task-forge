// components/SyncOnReconnect.tsx

import React, { useEffect } from 'react';
import axios from 'axios';

/**
 * SyncOnReconnect component to sync queued entries on browser reconnect.
 */
const SyncOnReconnect: React.FC = () => {
  useEffect(() => {
    const handleOnline = async () => {
      try {
        // Fetch the user's ID using JWT token
        const fetchUserId = async (): Promise<string | null> => {
          try {
            const response = await axios.get('/api/auth/me');
            if (response.status === 200) {
              return response.data.userId;
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
            await axios.post('/api/entries/sync', { userId }, {
              headers: {
                'Content-Type': 'application/json',
              },
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
      } catch (error) {
        console.error('Unexpected error during sync on reconnect:', error);
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