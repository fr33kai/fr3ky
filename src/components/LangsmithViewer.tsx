
// src/components/LangsmithViewer.tsx

import React, { useState, useEffect } from 'react';
import loggingService from '../services/LoggingService';

const LangsmithViewer: React.FC = () => {
  const [logs, setLogs] = useState(loggingService.getAllLogs());

  useEffect(() => {
    // Update the logs whenever there's a change in the log data
    const interval = setInterval(() => {
      setLogs(loggingService.getAllLogs());
    }, 1000); // Refresh logs every second
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Langsmith-style Prompt Viewer</h2>
      {logs.length === 0 ? (
        <p>No logs available.</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">ID</th>
              <th className="py-2">Timestamp</th>
              <th className="py-2">Prompt</th>
              <th className="py-2">Response</th>
              <th className="py-2">Model</th>
              <th className="py-2">Duration (ms)</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t">
                <td className="py-2">{log.id}</td>
                <td className="py-2">{log.timestamp.toLocaleString()}</td>
                <td className="py-2">{log.prompt}</td>
                <td className="py-2">{log.response}</td>
                <td className="py-2">{log.model}</td>
                <td className="py-2">{log.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LangsmithViewer;
