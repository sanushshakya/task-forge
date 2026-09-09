// app/admin/page.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AdminStatsPage from '@/app/admin/page';

describe('AdminStatsPage', () => {
  it('renders the admin statistics page correctly', async () => {
    // Mock data for testing
    const mockData = {
      totalUsers: 100,
      activeUsers: 85,
      subscriptionCount: 50,
      revenue: '$5,000.00',
    };

    // Render the AdminStatsPage component with mocked data
    render(<AdminStatsPage stats={mockData} />);

    // Check if the components and text are rendered correctly
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('Active Users')).toBeInTheDocument();
    expect(screen.getByText('Subscription Count')).toBeInTheDocument();
    expect(screen.getByText('Revenue')).toBeInTheDocument();

    // Check if the mock data is displayed correctly
    expect(screen.getByText(mockData.totalUsers.toString())).toBeInTheDocument();
    expect(screen.getByText(mockData.activeUsers.toString())).toBeInTheDocument();
    expect(screen.getByText(mockData.subscriptionCount.toString())).toBeInTheDocument();
    expect(screen.getByText(mockData.revenue)).toBeInTheDocument();
  });
});