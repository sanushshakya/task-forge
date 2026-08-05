import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Define TypeScript types for the summary callout box props
interface SummaryCalloutBoxProps {
  summaryText: string;
}

/**
 * Component to display the entry summary in a styled callout box.
 * @param props - The props object containing the summary text.
 */
const SummaryCalloutBox: React.FC<SummaryCalloutBoxProps> = ({ summaryText }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (summaryText) {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 5000); // Hide after 5 seconds
    }
  }, [summaryText]);

  return (
    <div className={`callout-box ${isVisible ? 'visible' : ''}`}>
      {summaryText}
    </div>
  );
};

export default SummaryCalloutBox;