import React, { useEffect, useState } from 'react';
import axios from 'axios';

/**
 * EntryList component — Fetches and renders a list of entries.
 */
const EntryList: React.FC<{ entries: Array<{ id: string; title: string; content: string; date: Date; mood: string; completedTasks: number }> }> = ({ entries }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get('/api/entries');
        setEntries(response.data.entries);
        setLoading(false);
      } catch (err) {
        setError('Failed to load entries');
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {entries.map(entry => (
        <li key={entry.id}>
          <h3>{entry.title}</h3>
          <p>{entry.content}</p>
          <small>Date: {entry.date.toLocaleDateString()}</small>
          <small>Mood: {entry.mood}</small>
          <small>Completed Tasks: {entry.completedTasks}</small>
        </li>
      ))}
    </ul>
  );
};

export default EntryList;