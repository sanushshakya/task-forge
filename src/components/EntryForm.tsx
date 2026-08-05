// src/components/EntryForm.tsx
import React, { useState } from 'react';
import axios from 'axios';

interface Entry {
  id?: string;
  title: string;
  description: string;
}

const EntryForm: React.FC = () => {
  const [entry, setEntry] = useState<Entry>({ title: '', description: '' });
  const [summary, setSummary] = useState<string | null>(null);

  // Handle form input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setEntry({ ...entry, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // Save the entry to the server
      const response = await axios.post('/api/entries', entry);
      const savedEntryId = response.data.id;

      // Fetch the summary for the saved entry
      const summaryResponse = await axios.get(`/api/summary/${savedEntryId}`);
      setSummary(summaryResponse.data.summary);

      console.log('Entry saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title</label>
        <input type="text" name="title" value={entry.title} onChange={handleInputChange} required />
      </div>
      <div>
        <label>Description</label>
        <textarea name="description" value={entry.description} onChange={handleInputChange} required />
      </div>
      <button type="submit">Save Entry and Fetch Summary</button>
    </form>
    {summary && (
      <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
        <h3>Entry Summary:</h3>
        <p>{summary}</p>
      </div>
    )}
  );
};

export default EntryForm;