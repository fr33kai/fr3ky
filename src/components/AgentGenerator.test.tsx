import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AgentGenerator from './AgentGenerator';
import { AgentService } from '../services/AgentService';
import { ToolService } from '../services/ToolService';

jest.mock('../services/AgentService');
jest.mock('../services/ToolService');

describe('AgentGenerator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<AgentGenerator />);
    expect(screen.getByText('Agent Generator and Executor')).toBeInTheDocument();
  });

  it('fetches and displays agents and tools', async () => {
    const mockAgents = [
      { id: '1', name: 'Agent 1', specialization: 'Spec 1' },
      { id: '2', name: 'Agent 2', specialization: 'Spec 2' },
    ];
    const mockTools = [
      { id: '1', name: 'Tool 1' },
      { id: '2', name: 'Tool 2' },
    ];
    (AgentService.getAll as jest.Mock).mockResolvedValue(mockAgents);
    (ToolService.getAll as jest.Mock).mockResolvedValue(mockTools);

    render(<AgentGenerator />);

    await waitFor(() => {
      expect(screen.getByText('Agent 1')).toBeInTheDocument();
      expect(screen.getByText('Agent 2')).toBeInTheDocument();
      expect(screen.getByText('Tool 1')).toBeInTheDocument();
      expect(screen.getByText('Tool 2')).toBeInTheDocument();
    });
  });

  it('generates a new agent', async () => {
    const mockTools = [{ id: '1', name: 'Tool 1' }];
    (ToolService.getAll as jest.Mock).mockResolvedValue(mockTools);
    (AgentService.create as jest.Mock).mockResolvedValue({ id: '3', name: 'Generated Agent', specialization: 'New Spec' });

    render(<AgentGenerator />);

    await waitFor(() => {
      expect(screen.getByText('Tool 1')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Enter agent specialization'), { target: { value: 'New Spec' } });
    fireEvent.change(screen.getByRole('listbox'), { target: { value: ['1'] } });
    fireEvent.click(screen.getByText('Generate Agent'));

    await waitFor(() => {
      expect(screen.getByText('Generated Agent')).toBeInTheDocument();
    });
  });

  it('executes an agent', async () => {
    const mockAgents = [{ id: '1', name: 'Test Agent', specialization: 'Test Spec' }];
    (AgentService.getAll as jest.Mock).mockResolvedValue(mockAgents);
    (AgentService.execute as jest.Mock).mockResolvedValue('Agent execution result');

    render(<AgentGenerator />);

    await waitFor(() => {
      expect(screen.getByText('Test Agent')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });
    fireEvent.change(screen.getByPlaceholderText('Enter execution input'), { target: { value: 'Test input' } });
    fireEvent.click(screen.getByText('Execute Agent'));

    await waitFor(() => {
      expect(screen.getByText('Agent execution result')).toBeInTheDocument();
    });
  });

  it('displays error messages when fetching fails', async () => {
    (AgentService.getAll as jest.Mock).mockRejectedValue(new Error('Fetch agents error'));
    (ToolService.getAll as jest.Mock).mockRejectedValue(new Error('Fetch tools error'));

    render(<AgentGenerator />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch agents. Please try again.')).toBeInTheDocument();
      expect(screen.getByText('Failed to fetch tools. Please try again.')).toBeInTheDocument();
    });
  });
});