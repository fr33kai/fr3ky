import axios from 'axios';
import { KnowledgeBase } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const KnowledgeBaseService = {
  async getAll(): Promise<KnowledgeBase[]> {
    try {
      const response = await axios.get(`${API_URL}/knowledge-bases`);
      return response.data.map((kb: any) => ({
        id: kb.id,
        name: kb.name,
        content: kb.content
      }));
    } catch (error) {
      console.error('Error fetching knowledge bases:', error);
      return [];
    }
  },

  async create(name: string, content: string): Promise<KnowledgeBase> {
    try {
      const response = await axios.post(`${API_URL}/knowledge-bases`, { name, content });
      return response.data;
    } catch (error) {
      console.error('Error creating knowledge base:', error);
      throw new Error('Failed to create knowledge base');
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/knowledge-bases/${id}`);
    } catch (error) {
      console.error('Error deleting knowledge base:', error);
      throw new Error('Failed to delete knowledge base');
    }
  },

  async generate(topic: string): Promise<KnowledgeBase> {
    try {
      const response = await axios.post(`${API_URL}/knowledge-bases/generate`, { topic });
      return response.data;
    } catch (error) {
      console.error('Error generating knowledge base:', error);
      throw new Error('Failed to generate knowledge base');
    }
  },
};