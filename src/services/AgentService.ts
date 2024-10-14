import axios from 'axios';
import { Agent, Tool } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const AgentService = {
  async getAll(): Promise<Agent[]> {
    try {
      const response = await axios.get(`${API_URL}/agents`);
      return response.data;
    } catch (error) {
      console.error('Error fetching agents:', error);
      return [];
    }
  },

  async create(specialization: string, availableTools: string[]): Promise<Agent> {
    try {
      const response = await axios.post(`${API_URL}/agents`, { specialization, availableTools });
      return response.data;
    } catch (error) {
      console.error('Error creating agent:', error);
      throw new Error('Failed to create agent');
    }
  },

  async execute(agentId: string, input: string, tools: Tool[]): Promise<string> {
    try {
      const response = await axios.post(`${API_URL}/agents/${agentId}/execute`, { input, tools });
      return response.data;
    } catch (error) {
      console.error('Error executing agent:', error);
      throw new Error('Failed to execute agent');
    }
  },
};