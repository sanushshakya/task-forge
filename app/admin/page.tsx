// app/admin/page.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

/**
 * AdminStats component fetches and displays admin statistics.
 */
const AdminStats: React.FC = () => {
  const [stats, setStats] = useState<{ totalUsers: number; activeSubscriptions: number } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const response = await axios.get('/api/admin/stats');
        setStats(response.data);
      } catch (err) {
        setError('Failed to fetch admin statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Admin Statistics</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-100 p-4 rounded-lg text-center">
          <h3 className="font-semibold">Total Users</h3>
          <p>{stats?.totalUsers}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg text-center">
          <h3 className="font-semibold">Active Subscriptions</h3>
          <p>{stats?.activeSubscriptions}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;