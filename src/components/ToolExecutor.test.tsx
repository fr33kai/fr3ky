import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ToolExecutor from './ToolExecutor';
import { ToolService } from '../services/ToolService';

// Mock the ToolService
jest.mock('../services/ToolService', () => ({
  getAll: jest.fn(),
  execute: jest.fn(),
  executeWithGroq: jest.fn(),
}));

describe('ToolExecutor', () => {
  const mockTools = [
    { id: '1', name: 'Tool 1' },
    { id: '2', name: 'Tool 2' },
  ];

  beforeEach(() => {
    (ToolService.getAll as jest.Mock).mockResolvedValue(mockTools);
  });

  test('renders ToolExecutor component', async () => {
    render(<ToolExecutor />);
    expect(screen.getByText('Tool Executor')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Select a tool')).toBeInTheDocument();
    });
  });

  // ... (rest of the test cases remain the same)
});
