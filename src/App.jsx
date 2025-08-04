// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { FilterProvider } from './contexts/FilterContext';
import PlayerPage from './pages/PlayerPage';
import StandalonePlayer from './pages/StandalonePlayer';
import DebugMonitor from './components/DebugMonitor';

function App() {
  const [debugVisible, setDebugVisible] = useState(false);
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    const checkElectron = () => {
      const isElectronEnv = window.electronAPI !== undefined;
      setIsElectron(isElectronEnv);
      
      console.log('🚀 SharkTV iniciado:', {
        environment: isElectronEnv ? 'Electron' : 'Browser',
        electronAPI: !!window.electronAPI,
        timestamp: new Date().toISOString()
      });

      if (!isElectronEnv) {
        console.warn('⚠️ Aplicação não está rodando no Electron. Algumas funcionalidades podem não funcionar.');
      }
    };

    checkElectron();

    // Listener para Ctrl+Shift+D para toggle do debug
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        setDebugVisible(prev => !prev);
        console.log('🐛 Debug monitor toggled');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="App">
      <FilterProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<PlayerPage />} />
          <Route path="/player" element={<StandalonePlayer />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>

        {/* Debug Monitor */}
        <DebugMonitor 
          isVisible={debugVisible} 
          onToggle={() => setDebugVisible(!debugVisible)} 
        />

        {/* Aviso se não estiver no Electron */}
        {!isElectron && (
          <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 z-40">
            ⚠️ Aplicação deve ser executada via Electron para funcionar corretamente
          </div>
        )}
      </FilterProvider>
    </div>
  );
}

export default App;