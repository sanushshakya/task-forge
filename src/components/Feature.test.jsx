import React from 'react';
import { useState } from 'react';

// Define TypeScript types for the form state
interface EntryFormState {
  task: string;
  mood: number;
  notes: string;
}

const EntryForm = () => {
  const [formState, setFormState] = useState<EntryFormState>({
    task: '',
    mood: 3,
    notes: ''
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formState)
      });
      if (!response.ok) {
        throw new Error('Failed to create entry');
      }
      setFormState({
        task: '',
        mood: 3,
        notes: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="task">Task:</label>
        <input
          type="text"
          id="task"
          name="task"
          value={formState.task}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="mood">Mood (1-5):</label>
        <input
          type="range"
          id="mood"
          name="mood"
          min="1"
          max="5"
          value={formState.mood}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="notes">Notes:</label>
        <textarea
          id="notes"
          name="notes"
          value={formState.notes}
          onChange={handleChange}
          required
        ></textarea>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default EntryForm;