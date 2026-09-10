// app/admin/page.tsx

import React from 'react';
import { useQuery } from '@tanstack/react-query';

interface AdminStatistics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  subscriptionCount: number;
}

const fetchAdminStatistics = async () => {
  const response = await fetch('/api/admin/stats');
  if (!response.ok) {
    throw new Error('Failed to fetch admin statistics');
  }
  return response.json() as AdminStatistics;
};

const AdminPage: React.FC = () => {
  const { data, isLoading, isError } = useQuery<AdminStatistics>(
    'adminStats',
    fetchAdminStatistics
  );

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching admin statistics</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Statistics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Total Users</h2>
          <p>{data.totalUsers}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Active Users</h2>
          <p>{data.activeUsers}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Inactive Users</h2>
          <p>{data.inactiveUsers}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Subscription Count</h2>
          <p>{data.subscriptionCount}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;