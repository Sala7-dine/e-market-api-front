import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaInfoCircle, FaExclamationCircle, FaTrash } from 'react-icons/fa';
import clientLogger from '../../utils/clientLogger';

const LogsViewer = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    setLogs(clientLogger.getLogs());
    
    // Actualiser toutes les 2 secondes
    const interval = setInterval(() => {
      setLogs([...clientLogger.getLogs()]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getLogIcon = (level) => {
    switch (level) {
      case 'ERROR': return <FaExclamationTriangle style={{ color: '#ef4444' }} />;
      case 'WARN': return <FaExclamationCircle style={{ color: '#f59e0b' }} />;
      default: return <FaInfoCircle style={{ color: '#3b82f6' }} />;
    }
  };

  const getLogStyle = (level) => ({
    padding: '1rem',
    marginBottom: '0.5rem',
    borderRadius: '8px',
    backgroundColor: level === 'ERROR' ? '#fef2f2' : level === 'WARN' ? '#fffbeb' : '#eff6ff',
    border: `1px solid ${level === 'ERROR' ? '#fecaca' : level === 'WARN' ? '#fed7aa' : '#bfdbfe'}`,
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem'
  });

  const clearLogs = () => {
    clientLogger.clearLogs();
    setLogs([]);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Logs Client ({logs.length})</h2>
          <p>Surveillance des erreurs frontend en temps réel</p>
        </div>
        <button 
          onClick={clearLogs}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          <FaTrash />
          Vider les logs
        </button>
      </div>

      <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
        {logs.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem', 
            color: '#6b7280',
            backgroundColor: '#f9fafb',
            borderRadius: '8px'
          }}>
            Aucun log disponible
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} style={getLogStyle(log.level)}>
              {getLogIcon(log.level)}
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontWeight: '600', 
                  fontSize: '1rem', 
                  marginBottom: '0.5rem',
                  color: log.level === 'ERROR' ? '#dc2626' : log.level === 'WARN' ? '#d97706' : '#2563eb'
                }}>
                  [{log.level}] {log.message}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                  {new Date(log.timestamp).toLocaleString()}
                </div>
                {log.data && (
                  <pre style={{ 
                    fontSize: '0.8rem', 
                    backgroundColor: '#f3f4f6',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    overflow: 'auto',
                    maxHeight: '150px',
                    margin: 0
                  }}>
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                )}
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                  URL: {log.url}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LogsViewer;