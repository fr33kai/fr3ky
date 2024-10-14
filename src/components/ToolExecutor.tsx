import React, { useState, useEffect } from 'react';
import { Tool } from '../types';
import { ToolService } from '../services/ToolService';
// Import Play icon as a simple string
const PlayIcon = "▶️";
import LoadingSpinner from './LoadingSpinner';

const ToolExecutor: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [params, setParams] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [useGroq, setUseGroq] = useState<boolean>(false);

  useEffect(() => {
    fetchTools();
  }, []);

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

  const handleExecute = async () => {
    if (!selectedTool) return;
    setLoading(true);
    setError(null);
    setResult('');
    try {
      const parsedParams = JSON.parse(params);
      const executionResult = useGroq
        ? await ToolService.executeWithGroq(selectedTool.id, parsedParams)
        : await ToolService.execute(selectedTool.id, parsedParams);
      setResult(JSON.stringify(executionResult, null, 2));
    } catch (error) {
      console.error('Error executing tool:', error);
      setError('Failed to execute tool. Please check your parameters and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Tool Executor</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="flex mb-8">
        <div className="w-1/2 pr-4">
          <h3 className="text-xl font-semibold mb-4">Execute Tool</h3>
          {loading ? (
            <LoadingSpinner />
          ) : tools.length > 0 ? (
            <>
              <select
                value={selectedTool?.id || ''}
                onChange={(e) => setSelectedTool(tools.find(t => t.id === e.target.value) || null)}
                className="w-full border p-2 mb-4 rounded"
              >
                <option value="">Select a tool</option>
                {tools.map((tool) => (
                  <option key={tool.id} value={tool.id}>{tool.name}</option>
                ))}
              </select>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={useGroq}
                    onChange={(e) => setUseGroq(e.target.checked)}
                    className="mr-2"
                  />
                  Use Groq for execution
                </label>
              </div>
              <textarea
                value={params}
                onChange={(e) => setParams(e.target.value)}
                placeholder="Enter parameters as JSON"
                className="w-full border p-2 mb-4 rounded h-32"
              />
              <button
                onClick={handleExecute}
                disabled={!selectedTool}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
              >
                {PlayIcon} Execute
              </button>
            </>
          ) : (
            <p>No tools found. Generate or create a tool to get started!</p>
          )}
        </div>
        <div className="w-1/2 pl-4">
          <h3 className="text-xl font-semibold mb-4">Result</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-auto h-64">
            {result || 'Execution result will appear here'}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ToolExecutor;
