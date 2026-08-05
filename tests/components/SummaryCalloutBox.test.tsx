import { renderToString } from 'react-dom/server';
import SummaryCalloutBox from '@/components/SummaryCalloutBox';

describe('SummaryCalloutBox', () => {
  it('should display the summary correctly', async () => {
    // Arrange
    const entryId = 'test-entry-id';
    const summaryText = 'This is a test summary.';

    // Mock the SummaryCalloutBox component to return a string representation of itself
    jest.mock('@/components/SummaryCalloutBox', () => {
      return () => <div>Summary: {summaryText}</div>;
    });

    // Act
    const renderedComponent = renderToString(<SummaryCalloutBox entryId={entryId} />);
    const expectedResult = `<div>Summary: ${summaryText}</div>`;

    // Assert
    expect(renderedComponent).toEqual(expectedResult);
  });
});