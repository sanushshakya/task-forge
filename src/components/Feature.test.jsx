import { render } from '@testing-library/react';
import Feature from '../components/Feature';

describe('Feature Component', () => {
  it('renders Free Plan when user is on free plan', async () => {
    const mockData = {
      plan: 'free',
      canUpgrade: true,
    };

    const { getByText, getByRole } = render(<Feature data={mockData} />);

    expect(getByText('Free Plan')).toBeInTheDocument();
    expect(getByRole('button').textContent).toBe('Upgrade to Pro');
  });

  it('renders Pro Plan when user is on pro plan', async () => {
    const mockData = {
      plan: 'pro',
      canUpgrade: false,
    };

    const { getByText } = render(<Feature data={mockData} />);

    expect(getByText('Pro Plan')).toBeInTheDocument();
    expect(() => getByRole('button')).toThrow(/Unable to find an element with role "button"/);
  });
});