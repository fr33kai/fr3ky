import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home: React.FC = () => {
  const [groqApiKey, setGroqApiKey] = useState('');
  const [anthropicApiKey, setAnthropicApiKey] = useState('');
  const [apiStatus, setApiStatus] = useState({ groq: '', anthropic: '' });

  useEffect(() => {
    const savedGroqApiKey = localStorage.getItem('groqApiKey');
    const savedAnthropicApiKey = localStorage.getItem('anthropicApiKey');
    if (savedGroqApiKey) setGroqApiKey(savedGroqApiKey);
    if (savedAnthropicApiKey) setAnthropicApiKey(savedAnthropicApiKey);
  }, []);

  const validateApiKey = async (apiKey: string, type: 'groq' | 'anthropic') => {
    try {
      const url = type === 'groq' 
        ? 'https://api.groq.com/v1/models' 
        : 'https://api.anthropic.com/v1/models';
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${apiKey}` }
      });
      
      if (response.status === 200) {
        setApiStatus(prev => ({ ...prev, [type]: 'Valid' }));
        localStorage.setItem(`${type}ApiKey`, apiKey);
        return true;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Error validating ${type} API key:`, error.message);
        setApiStatus(prev => ({ ...prev, [type]: `Invalid: ${error.message}` }));
      } else {
        console.error(`Error validating ${type} API key:`, error);
        setApiStatus(prev => ({ ...prev, [type]: 'Invalid: Unknown error' }));
      }
    }
    return false;
  };

  const handleSaveApiKeys = async () => {
    const groqValid = await validateApiKey(groqApiKey, 'groq');
    const anthropicValid = await validateApiKey(anthropicApiKey, 'anthropic');

    if (groqValid && anthropicValid) {
      alert('API keys are valid and have been saved successfully!');
    } else {
      alert('One or more API keys are invalid. Please check the error messages and try again.');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">AI Assistant Configuration</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Groq API Key</label>
        <input
          type="password"
          value={groqApiKey}
          onChange={(e) => setGroqApiKey(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {apiStatus.groq && <p className={`mt-1 text-sm ${apiStatus.groq.includes('Invalid') ? 'text-red-600' : 'text-green-600'}`}>{apiStatus.groq}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Anthropic API Key</label>
        <input
          type="password"
          value={anthropicApiKey}
          onChange={(e) => setAnthropicApiKey(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {apiStatus.anthropic && <p className={`mt-1 text-sm ${apiStatus.anthropic.includes('Invalid') ? 'text-red-600' : 'text-green-600'}`}>{apiStatus.anthropic}</p>}
      </div>
      <button
        onClick={handleSaveApiKeys}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Save and Verify API Keys
      </button>
    </div>
  );
};

export default Home;