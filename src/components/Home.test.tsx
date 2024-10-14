import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from './Home';
import axios from 'axios';

jest.mock('axios');

describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders without crashing', () => {
    render(<Home />);
    expect(screen.getByText('AI Assistant Configuration')).toBeInTheDocument();
  });

  it('loads saved API keys from localStorage', () => {
    localStorage.setItem('groqApiKey', 'saved-groq-key');
    localStorage.setItem('anthropicApiKey', 'saved-anthropic-key');
    render(<Home />);
    expect(screen.getByLabelText('Groq API Key')).toHaveValue('saved-groq-key');
    expect(screen.getByLabelText('Anthropic API Key')).toHaveValue('saved-anthropic-key');
  });

  it('validates API keys successfully', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ status: 200 });
    render(<Home />);
    
    fireEvent.change(screen.getByLabelText('Groq API Key'), { target: { value: 'valid-groq-key' } });
    fireEvent.change(screen.getByLabelText('Anthropic API Key'), { target: { value: 'valid-anthropic-key' } });
    fireEvent.click(screen.getByText('Save and Verify API Keys'));

    await waitFor(() => {
      expect(screen.getByText('Valid')).toBeInTheDocument();
    });
    expect(localStorage.getItem('groqApiKey')).toBe('valid-groq-key');
    expect(localStorage.getItem('anthropicApiKey')).toBe('valid-anthropic-key');
  });

  it('handles API key validation failure', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('Invalid API key'));
    render(<Home />);
    
    fireEvent.change(screen.getByLabelText('Groq API Key'), { target: { value: 'invalid-groq-key' } });
    fireEvent.change(screen.getByLabelText('Anthropic API Key'), { target: { value: 'invalid-anthropic-key' } });
    fireEvent.click(screen.getByText('Save and Verify API Keys'));

    await waitFor(() => {
      expect(screen.getByText('Invalid: Invalid API key')).toBeInTheDocument();
    });
  });
});