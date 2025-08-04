// src/components/DebugMonitor.jsx
import React, { useState, useEffect } from 'react';

const DebugMonitor = ({ isVisible, onToggle }) => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        if (!isVisible) return;

        const originalConsole = {
            log: console.log,
            error: console.error,
            warn: console.warn
        };

        const addLog = (type, args) => {
            const message = args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ');

            setLogs(prev => [...prev.slice(-20), { 
                type, 
                message, 
                timestamp: new Date().toLocaleTimeString() 
            }]);
        };

        console.log = (...args) => {
            originalConsole.log(...args);
            addLog('log', args);
        };

        console.error = (...args) => {
            originalConsole.error(...args);
            addLog('error', args);
        };

        console.warn = (...args) => {
            originalConsole.warn(...args);
            addLog('warn', args);
        };

        return () => {
            Object.assign(console, originalConsole);
        };
    }, [isVisible]);

    const testAPI = async () => {
        try {
            console.log('🧪 Testando API...');
            const response = await window.electronAPI.fetchData(
                'http://xwkhb.info/player_api.php?username=jack552145&password=Ja125452ck&action=get_vod_categories'
            );
            console.log('✅ API funcionando:', response.status);
        } catch (error) {
            console.error('❌ Erro na API:', error.message);
        }
    };

    if (!isVisible) {
        return (
            <button
                onClick={onToggle}
                className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 z-50"
                title="Debug Monitor (Ctrl+Shift+D)"
            >
                🐛
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col">
            {/* Header */}
            <div className="bg-gray-800 p-4 flex justify-between items-center">
                <h2 className="text-white text-lg font-bold">🐛 Debug Monitor</h2>
                <div className="flex gap-2">
                    <button
                        onClick={testAPI}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                        Testar API
                    </button>
                    <button
                        onClick={() => setLogs([])}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    >
                        Limpar
                    </button>
                    <button
                        onClick={onToggle}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                    >
                        Fechar
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="bg-gray-700 p-3 text-white text-sm">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <strong>Electron API:</strong> {window.electronAPI ? '✅ Disponível' : '❌ Indisponível'}
                    </div>
                    <div>
                        <strong>Logs:</strong> {logs.length}/20
                    </div>
                </div>
            </div>

            {/* Logs */}
            <div className="flex-1 overflow-auto p-4 bg-gray-900">
                {logs.length === 0 ? (
                    <div className="text-gray-400 text-center py-8">
                        Nenhum log ainda. Pressione "Testar API" ou execute alguma ação.
                    </div>
                ) : (
                    <div className="space-y-1 font-mono text-sm">
                        {logs.map((log, index) => (
                            <div key={index} className="flex gap-3 border-l-2 border-gray-600 pl-3">
                                <span className="text-gray-500 text-xs">
                                    {log.timestamp}
                                </span>
                                <span className={
                                    log.type === 'error' ? 'text-red-400' :
                                    log.type === 'warn' ? 'text-yellow-400' :
                                    'text-gray-300'
                                }>
                                    {log.message}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DebugMonitor;