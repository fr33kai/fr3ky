import React, { useState, useEffect } from 'react';
import { KnowledgeBase } from '../types';
import { KnowledgeBaseService } from '../services/KnowledgeBaseService';
import { Plus, Trash2, RefreshCw } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const KnowledgeBaseManager: React.FC = () => {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [newKBName, setNewKBName] = useState('');
  const [newKBContent, setNewKBContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchKnowledgeBases();
  }, []);

  const fetchKnowledgeBases = async () => {
    setLoading(true);
    setError(null);
    try {
      const kbs = await KnowledgeBaseService.getAll();
      setKnowledgeBases(kbs);
    } catch (error) {
      console.error('Error fetching knowledge bases:', error);
      setError('Failed to fetch knowledge bases. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKB = async () => {
    if (!newKBName || !newKBContent) {
      setError('Please provide both name and content for the new knowledge base.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await KnowledgeBaseService.create(newKBName, newKBContent);
      setNewKBName('');
      setNewKBContent('');
      await fetchKnowledgeBases();
    } catch (error) {
      console.error('Error creating knowledge base:', error);
      setError('Failed to create knowledge base. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKB = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await KnowledgeBaseService.delete(id);
      await fetchKnowledgeBases();
    } catch (error) {
      console.error('Error deleting knowledge base:', error);
      setError('Failed to delete knowledge base. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Knowledge Base Manager</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="flex mb-8">
        <div className="w-2/3 pr-4">
          <h3 className="text-xl font-semibold mb-4">Create New Knowledge Base</h3>
          <input
            type="text"
            value={newKBName}
            onChange={(e) => setNewKBName(e.target.value)}
            placeholder="Knowledge Base Name"
            className="w-full border p-2 mb-4 rounded"
          />
          <textarea
            value={newKBContent}
            onChange={(e) => setNewKBContent(e.target.value)}
            placeholder="Knowledge Base Content"
            className="w-full border p-2 mb-4 rounded h-32"
          />
          <button
            onClick={handleCreateKB}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            <Plus className="inline mr-2" size={20} />
            Create Knowledge Base
          </button>
        </div>
        <div className="w-1/3 pl-4">
          <h3 className="text-xl font-semibold mb-4">Existing Knowledge Bases</h3>
          {loading ? (
            <LoadingSpinner />
          ) : knowledgeBases.length > 0 ? (
            <ul>
              {knowledgeBases.map((kb) => (
                <li key={kb.id} className="mb-2 flex items-center justify-between">
                  <span>{kb.name}</span>
                  <button
                    onClick={() => handleDeleteKB(kb.id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Delete"
                  >
                    <Trash2 size={20} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No knowledge bases found. Create one to get started!</p>
          )}
        </div>
      </div>
      <button
        onClick={fetchKnowledgeBases}
        disabled={loading}
        className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 disabled:bg-gray-100"
      >
        <RefreshCw className="inline mr-2" size={20} />
        Refresh Knowledge Bases
      </button>
    </div>
  );
};

export default KnowledgeBaseManager;