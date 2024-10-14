import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import KnowledgeBaseManager from './KnowledgeBaseManager';
import { KnowledgeBaseService } from '../services/KnowledgeBaseService';

jest.mock('../services/KnowledgeBaseService');

describe('KnowledgeBaseManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<KnowledgeBaseManager />);
    expect(screen.getByText('Knowledge Base Manager')).toBeInTheDocument();
  });

  it('fetches and displays knowledge bases', async () => {
    const mockKnowledgeBases = [
      { id: '1', name: 'KB 1', content: 'Content 1' },
      { id: '2', name: 'KB 2', content: 'Content 2' },
    ];
    (KnowledgeBaseService.getAll as jest.Mock).mockResolvedValue(mockKnowledgeBases);

    render(<KnowledgeBaseManager />);

    await waitFor(() => {
      expect(screen.getByText('KB 1')).toBeInTheDocument();
      expect(screen.getByText('KB 2')).toBeInTheDocument();
    });
  });

  it('creates a new knowledge base', async () => {
    (KnowledgeBaseService.create as jest.Mock).mockResolvedValue({ id: '3', name: 'New KB', content: 'New Content' });
    (KnowledgeBaseService.getAll as jest.Mock).mockResolvedValue([{ id: '3', name: 'New KB', content: 'New Content' }]);

    render(<KnowledgeBaseManager />);

    fireEvent.change(screen.getByPlaceholderText('Knowledge Base Name'), { target: { value: 'New KB' } });
    fireEvent.change(screen.getByPlaceholderText('Knowledge Base Content'), { target: { value: 'New Content' } });
    fireEvent.click(screen.getByText('Create Knowledge Base'));

    await waitFor(() => {
      expect(screen.getByText('New KB')).toBeInTheDocument();
    });
  });

  it('deletes a knowledge base', async () => {
    const mockKnowledgeBases = [{ id: '1', name: 'KB to Delete', content: 'Content' }];
    (KnowledgeBaseService.getAll as jest.Mock).mockResolvedValue(mockKnowledgeBases);
    (KnowledgeBaseService.delete as jest.Mock).mockResolvedValue(undefined);

    render(<KnowledgeBaseManager />);

    await waitFor(() => {
      expect(screen.getByText('KB to Delete')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('Delete'));

    await waitFor(() => {
      expect(screen.queryByText('KB to Delete')).not.toBeInTheDocument();
    });
  });

  it('displays an error message when fetching fails', async () => {
    (KnowledgeBaseService.getAll as jest.Mock).mockRejectedValue(new Error('Fetch error'));

    render(<KnowledgeBaseManager />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch knowledge bases. Please try again.')).toBeInTheDocument();
    });
  });
});