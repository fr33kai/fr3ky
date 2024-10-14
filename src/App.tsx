import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import KnowledgeBaseManager from './components/KnowledgeBaseManager';
import ToolExecutor from './components/ToolExecutor';
import AgentGenerator from './components/AgentGenerator';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  
    import LangsmithViewer from './components/LangsmithViewer';

    return (
    
    <div className="flex min-h-screen bg-gray-100">
      
    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
    <button
        className={`px-4 py-2 m-2 rounded ${activeTab === 'logs' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
        onClick={() => setActiveTab('logs')}
      >
        Logs
      </button>
    
      <ErrorBoundary>
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'home' && <Home />}
          {activeTab === 'knowledge' && <KnowledgeBaseManager />}
          {activeTab === 'tools' && <ToolExecutor />}
          
    {activeTab === 'agents' && <AgentGenerator />}
    {activeTab === 'logs' && <LangsmithViewer />}
    
        </main>
      </ErrorBoundary>
    </div>
  );
}

export default App;