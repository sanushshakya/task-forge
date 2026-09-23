// components/CalendarHeatmap.tsx

import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { scaleLinear } from '@visx/scale';
import { Group } from '@visx/group';
import { LineMark } from '@visx/shape';

/**
 * Component for rendering a calendar heatmap.
 * @param data - Array of objects containing date and value
 */
const CalendarHeatmap: React.FC<{ data: { date: string; value: number }[] }> = ({ data }) => {
  const [fetchedData, setFetchedData] = useState<{ date: string; value: number }[]>([]);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats/monthly');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const result = await response.json();
        setFetchedData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchStats();
  }, []);

  // Extract unique dates from the data
  const dates = Array.from(new Set([...data, ...fetchedData].map(d => d.date)));

  // Calculate min and max values for scaling
  const minValue = Math.min(...[...data, ...fetchedData].map(d => d.value));
  const maxValue = Math.max(...[...data, ...fetchedData].map(d => d.value));

  // Create a linear scale based on the value range
  const colorScale = scaleLinear({
    domain: [minValue, maxValue],
    range: ['#f5deb3', '#e9967a'],
  });

  return (
    <svg width={800} height={400}>
      <Group top={20} left={20}>
        {dates.map((dateStr, index) => {
          const date = dayjs(dateStr);
          const x = index * 30;
          const y = 20 + (31 - date.date()) * 20;

          return (
            <LineMark
              key={index}
              from={{ x, y: y + 20 }}
              to={{ x, y }}
              stroke="#555"
              strokeWidth={1.5}
            />
          );
        })}
      </Group>
      <Group top={20} left={20}>
        {fetchedData.map((entry, index) => {
          const date = dayjs(entry.date);
          const x = (dates.indexOf(date.format('YYYY-MM-DD')) + 0.5) * 30;
          const y = 400 - (entry.value / (maxValue - minValue)) * 200;

          return (
            <rect
              key={index}
              x={x - 10}
              y={y}
              width={20}
              height={(entry.value / (maxValue - minValue)) * 200}
              fill={colorScale(entry.value)}
            />
          );
        })}
      </Group>
    </svg>
  );
};

export default CalendarHeatmap;