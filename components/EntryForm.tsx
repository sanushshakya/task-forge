import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Entry {
  id: string;
  title: string;
  content: string;
}

interface SummaryResponse {
  summary: string;
}

const EntryForm: React.FC = () => {
  const [entry, setEntry] = useState<Entry>({ id: '', title: '', content: '' });
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  /**
   * Fetches the summary for the current entry.
   */
  const fetchSummary = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post<SummaryResponse>('/api/summary', entry);
      setSummary(response.data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching the summary.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles changes to the entry content.
   * @param e - The change event from the textarea.
   */
  const handleEntryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEntry({ ...entry, content: e.target.value });
  };

  return (
    <div>
      <h1>Entry Form</h1>
      <textarea value={entry.content} onChange={handleEntryChange} placeholder="Write your entry here..." />
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {summary && <div>{summary.summary}</div>}
    </div>
  );
};

export default EntryForm;