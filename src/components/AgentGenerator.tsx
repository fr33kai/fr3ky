import React, { useState, useEffect } from 'react';
import { AgentService } from '../services/AgentService';
import { ToolService } from '../services/ToolService';
import { UserPlus, Send } from 'lucide-react';
import { Agent, Tool } from '../types';
import LoadingSpinner from './LoadingSpinner';

const AgentGenerator: React.FC = () => {
  // ... (keep existing state variables)

  useEffect(() => {
    fetchAgents();
    fetchTools();
  }, []);

  const fetchAgents = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedAgents = await AgentService.getAll();
      setAgents(fetchedAgents);
    } catch (error) {
      console.error('Error fetching agents:', error);
      setError('Failed to fetch agents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTools = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTools = await ToolService.getAll();
      setTools(fetchedTools);
    } catch (error) {
      console.error('Error fetching tools:', error);
      setError('Failed to fetch tools. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ... (keep other functions)

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Agent Generator and Executor</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="flex mb-8">
        <div className="w-1/2 pr-4">
          <h3 className="text-xl font-semibold mb-4">Generate New Agent</h3>
          {/* ... (keep existing input fields) */}
          {loading ? (
            <LoadingSpinner />
          ) : tools.length > 0 ? (
            <select
              multiple
              value={selectedTools}
              onChange={(e) => setSelectedTools(Array.from(e.target.selectedOptions, option => option.value))}
              className="w-full border p-2 mb-4 rounded h-32"
            >
              {tools.map((tool) => (
                <option key={tool.id} value={tool.id}>{tool.name}</option>
              ))}
            </select>
          ) : (
            <p>No tools found. Create tools before generating an agent.</p>
          )}
          {/* ... (keep rest of the JSX) */}
        </div>
        <div className="w-1/2 pl-4">
          <h3 className="text-xl font-semibold mb-4">Execute Agent</h3>
          {loading ? (
            <LoadingSpinner />
          ) : agents.length > 0 ? (
            <select
              onChange={(e) => {
                const selectedAgent = agents.find(a => a.id === e.target.value);
                if (selectedAgent) {
                  setExecutionInput(`Execute ${selectedAgent.name} with specialization: ${selectedAgent.specialization}`);
                }
              }}
              className="w-full border p-2 mb-4 rounded"
            >
              <option value="">Select an agent</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>{agent.name}</option>
              ))}
            </select>
          ) : (
            <p>No agents found. Generate an agent to get started!</p>
          )}
          {/* ... (keep rest of the JSX) */}
        </div>
      </div>
    </div>
  );
};

export default AgentGenerator;