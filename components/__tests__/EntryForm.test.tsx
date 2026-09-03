import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EntryForm from '../EntryForm';

describe('EntryForm', () => {
  it('renders the form with the correct initial values and controls', () => {
    render(<EntryForm onSubmit={jest.fn()} />);

    // Check if the form fields are rendered
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();

    // Check initial values
    expect(screen.getByLabelText(/title/i)).toHaveValue('');
    expect(screen.getByLabelText(/notes/i)).toHaveValue('');
  });

  it('updates the form fields on input', () => {
    render(<EntryForm onSubmit={jest.fn()} />);

    const titleInput = screen.getByLabelText(/title/i);
    const notesInput = screen.getByLabelText(/notes/i);

    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(notesInput, { target: { value: 'This is a test note.' } });

    expect(titleInput).toHaveValue('Test Title');
    expect(notesInput).toHaveValue('This is a test note.');
  });

  it('calls the onSubmit function when the form is submitted', () => {
    const handleSubmit = jest.fn();

    render(<EntryForm onSubmit={handleSubmit} />);

    fireEvent.submit(screen.getByRole('form'));

    expect(handleSubmit).toHaveBeenCalled();
  });

  it('enables auto-grow for the notes textarea', () => {
    render(<EntryForm onSubmit={jest.fn()} />);

    const notesInput = screen.getByLabelText(/notes/i) as HTMLTextAreaElement;

    // Simulate entering a large amount of text to test auto-grow
    fireEvent.change(notesInput, { target: { value: ' '.repeat(1000) } });

    expect(notesInput.style.height).toBeGreaterThan('30px');
  });

  it('meets touch target requirements', () => {
    render(<EntryForm onSubmit={jest.fn()} />);

    const formControls = [
      screen.getByLabelText(/title/i),
      screen.getByLabelText(/notes/i),
      screen.getByRole('button', { name: /submit/i }),
    ];

    // Check if all controls have a minimum touch target size of 44px x 44px
    formControls.forEach(control => {
      expect(parseInt(window.getComputedStyle(control).minWidth)).toBeGreaterThanOrEqual(44);
      expect(parseInt(window.getComputedStyle(control).minHeight)).toBeGreaterThanOrEqual(44);
    });
  });
});