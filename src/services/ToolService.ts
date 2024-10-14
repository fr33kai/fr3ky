// Import axios using a type declaration instead
declare const axios: any;

import { Tool } from '../types';

// Use a type assertion for import.meta.env
const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000';

export const ToolService = {
  async getAll(): Promise<Tool[]> {
    try {
      const response = await axios.get<Tool[]>(`${API_URL}/tools`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tools:', error);
      return [];
    }
  },

  async execute(toolId: string, params: any): Promise<any> {
    try {
      const response = await axios.post(`${API_URL}/tools/${toolId}/execute`, params);
      return response.data;
    } catch (error) {
      console.error('Error executing tool:', error);
      throw new Error('Failed to execute tool');
    }
  },

  async executeWithGroq(toolId: string, params: any): Promise<any> {
    try {
      const response = await axios.post(`${API_URL}/tools/${toolId}/execute-groq`, params);
      return response.data;
    } catch (error) {
      console.error('Error executing tool with Groq:', error);
      throw new Error('Failed to execute tool with Groq');
    }
  },

  async generate(description: string): Promise<Tool> {
    try {
      const response = await axios.post<Tool>(`${API_URL}/tools/generate`, { 
        description,
        model: 'llama-3.1-70b' // or 'llama-3.2-12b'
      });
      return response.data;
    } catch (error) {
      console.error('Error generating tool with Llama:', error);
      // Fall back to Claude Sonnet 3.5
      try {
        const fallbackResponse = await axios.post<Tool>(`${API_URL}/tools/generate-claude`, { description });
        return fallbackResponse.data;
      } catch (claudeError) {
        console.error('Error generating tool with Claude:', claudeError);
        throw new Error('Failed to generate tool with both Llama and Claude');
      }
    }
  },

  async create(toolData: any): Promise<Tool> {
    try {
      const response = await axios.post<Tool>(`${API_URL}/tools`, toolData);
      return response.data;
    } catch (error) {
      console.error('Error creating tool:', error);
      throw new Error('Failed to create tool');
    }
  },
};
