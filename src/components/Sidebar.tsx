import React from 'react';
import { Brain, Wrench, Users, Home } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'knowledge', name: 'Knowledge Bases', icon: Brain },
    { id: 'tools', name: 'Tools', icon: Wrench },
    { id: 'agents', name: 'Agents', icon: Users },
  ];

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-8">AI Assistant</h1>
      <nav>
        <ul>
          {tabs.map((tab) => (
            <li key={tab.id} className="mb-2">
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center w-full p-2 rounded ${
                  activeTab === tab.id ? 'bg-blue-600' : 'hover:bg-gray-700'
                }`}
              >
                <tab.icon className="mr-2" size={20} />
                {tab.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;