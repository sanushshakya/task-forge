// components/MoodChart.tsx

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface Entry {
  id: string;
  mood: number;
  createdAt: Date;
}

/**
 * MoodChart component to plot mood over the last 14 entries.
 * @param props - Props for the component.
 * @param props.entries - Array of mood entries.
 */
const MoodChart: React.FC<{ entries: Entry[] }> = ({ entries }) => {
  // Sort entries by createdAt to ensure correct order
  const sortedEntries = entries.sort((a, b) => a.createdAt - b.createdAt);

  return (
    <LineChart width={600} height={300} data={sortedEntries}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="createdAt" type="number" domain={['dataMin', 'dataMax']} tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()} />
      <YAxis domain={[1, 5]} tickFormatter={(value) => `Mood ${value}`} />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="mood" stroke="#8884d8" activeDot={{ r: 8 }} />
    </LineChart>
  );
};

export default MoodChart;