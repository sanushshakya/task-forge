import React, { useState, useEffect } from 'react';
import LineChart from 'recharts/lib/cartesian/LineChart';
import Line from 'recharts/lib/cartesian/Line';
import XAxis from 'recharts/lib/cartesian/XAxis';
import YAxis from 'recharts/lib/cartesian/YAxis';
import Tooltip from 'recharts/lib/component/Tooltip';

interface Entry {
  _id: string;
  mood: number;
  timestamp: Date;
}

interface MoodData {
  name: string;
  value: number;
}

const MoodParent: React.FC = () => {
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch('/api/entries?limit=14');
        if (!response.ok) {
          throw new Error('Failed to fetch entries');
        }
        const data: Entry[] = await response.json();
        
        // Convert entries to the format required by Recharts
        setMoodData(data.map(entry => ({
          name: entry.timestamp.toLocaleDateString(),
          value: entry.mood,
        })));
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };

    fetchEntries();
  }, []);

  return (
    <LineChart width={600} height={300} data={moodData}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
    </LineChart>
  );
};

export default MoodParent;