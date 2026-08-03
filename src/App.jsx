// src/components/EntryForm.tsx

import React, { useState } from 'react';

interface Entry {
  id: string;
  taskList: string[];
  mood: number;
  notes: string;
}

const EntryForm: React.FC = () => {
  const [taskList, setTaskList] = useState<string[]>([]);
  const [mood, setMood] = useState<number>(3);
  const [notes, setNotes] = useState<string>('');

  // Function to add a task to the list
  const handleAddTask = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.target.value.trim() !== '') {
        setTaskList([...taskList, e.target.value]);
        e.target.value = '';
      }
    }
  };

  // Function to remove a task from the list
  const handleRemoveTask = (index: number) => {
    setTaskList(taskList.filter((_, i) => i !== index));
  };

  // Function to toggle mood slider
  const handleMoodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMood(Number(e.target.value));
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskList,
          mood,
          notes,
        }),
      });

      if (response.ok) {
        // Handle success
        alert('Entry submitted successfully!');
      } else {
        // Handle error
        alert('Failed to submit entry.');
      }
    } catch (error) {
      console.error('Error submitting entry:', error);
      alert('An error occurred while submitting the entry.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h2>Task List</h2>
        {taskList.map((task, index) => (
          <div key={index}>
            <span>{task}</span>
            <button type="button" onClick={() => handleRemoveTask(index)}>Remove</button>
          </div>
        ))}
        <input type="text" placeholder="Add a task" onKeyDown={handleAddTask} />
      </div>
      <div>
        <h2>Mood Slider (1-5)</h2>
        <input type="range" min="1" max="5" value={mood} onChange={handleMoodChange} />
        <span>{mood}</span>
      </div>
      <div>
        <h2>Notes</h2>
        <textarea rows={4} cols={50} value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
      </div>
      <button type="submit">Submit Entry</button>
    </form>
  );
};

export default EntryForm;