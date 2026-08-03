import React, { useState } from 'react';
import { fetch } from 'node-fetch';

// Define TypeScript types for the form state
interface EntryFormState {
  task: string;
  mood: number;
  notes: string;
}

const EntryForm: React.FC = () => {
  // Initialize the form state with useState
  const [formState, setFormState] = useState<EntryFormState>({
    task: '',
    mood: 3,
    notes: ''
  });

  // Handle input changes and update the form state accordingly
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission and send data to the server via POST request
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formState)
      });
      if (!response.ok) {
        throw new Error('Failed to submit entry');
      }
      // Reset the form state after successful submission
      setFormState({
        task: '',
        mood: 3,
        notes: ''
      });
    } catch (error) {
      console.error('Error submitting entry:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Task input field */}
      <div>
        <label htmlFor="task">Task:</label>
        <input
          type="text"
          id="task"
          name="task"
          value={formState.task}
          onChange={handleInputChange}
          required
        />
      </div>

      {/* Mood slider */}
      <div>
        <label htmlFor="mood">Mood (1-5):</label>
        <input
          type="range"
          id="mood"
          name="mood"
          min="1"
          max="5"
          value={formState.mood}
          onChange={handleInputChange}
          required
        />
      </div>

      {/* Notes textarea */}
      <div>
        <label htmlFor="notes">Notes:</label>
        <textarea
          id="notes"
          name="notes"
          value={formState.notes}
          onChange={handleInputChange}
        ></textarea>
      </div>

      {/* Submit button */}
      <button type="submit">Submit</button>
    </form>
  );
};

export default EntryForm;