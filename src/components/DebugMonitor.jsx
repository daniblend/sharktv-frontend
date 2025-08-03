// --- ARQUIVO NOVO: src/components/DebugMonitor.jsx ---

import React, { useState, useEffect } from 'react';

const DebugMonitor = ({ isVisible, onToggle }) => {
    const [logs, setLogs] = useState([]);
    const [maxLogs] = useState(50);

    useEffect(() => {
        // Intercepta console.log, console.error, etc.
        const originalConsole = {
            log: console.log,
            error: console.error,
            warn: console.warn,
            info: console.info
        };

        const addLog = (type, args) => {
            const timestamp = new Date().toLocaleTimeString();
            const message = args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ');

            setLogs(prevLogs => {
                const newLogs = [...prevLogs, { type, timestamp, message }];
                return newLogs.slice(-maxLogs); // Mantém apenas os últimos logs
            });
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

        console.info = (...args) => {
            originalConsole.info(...args);
            addLog('info', args);
        };

        return () => {
            // Restaura console original
            Object.assign(console, originalConsole);
        };
    }, [maxLogs]);

    const clearLogs = () => setLogs([]);

    const getLogColor = (type) => {
        switch (type) {
            case 'error': return 'text-red-400';
            case 'warn': return 'text-yellow-400';
            case 'info': return 'text-blue-400';
            default: return 'text-gray-300';
        }
    };

    const testAPI = async () => {
        console.log('🧪 Testando API...');
        try {
            const testUrl = 'http://xwkhb.info/player_api.php?username=jack552145&password=Ja125452ck&action=get_vod_categories';
            const response = await window.electronAPI.fetchData(testUrl);
            console.log('✅ Teste da API bem-sucedido:', response);
        } catch (error) {
            console.error('❌ Teste da API falhou:', error);
        }
    };

    const testProxy = async () => {
        console.log('🧪 Testando Proxy...');
        try {
            const testStreamUrl = 'http://xwkhb.info/live/jack552145/Ja125452ck/123.m3u8';
            const proxyUrl = await window.electronAPI.startProxy(testStreamUrl, 'live');
            console.log('✅ Proxy iniciado:', proxyUrl);
            
            // Testa requisição ao proxy
            const response = await fetch(proxyUrl);
            console.log('✅ Teste do proxy bem-sucedido:', response.status);
        } catch (error) {
            console.error('❌ Teste do proxy falhou:', error);
        }
    };

    if (!isVisible) {
        return (
            <button
                onClick={onToggle}
                className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 z-50"
                title="Abrir Debug Monitor"
            >
                🐛
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
            {/* Header */}
            <div className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-600">
                <h2 className="text-white text-lg font-bold">🐛 Debug Monitor</h2>
                <div className="flex gap-2">
                    <button
                        onClick={testAPI}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                        Testar API
                    </button>
                    <button
                        onClick={testProxy}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                    >
                        Testar Proxy
                    </button>
                    <button
                        onClick={clearLogs}
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

            {/* System Info */}
            <div className="bg-gray-700 p-3 text-white text-sm border-b border-gray-600">
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <strong>Electron API:</strong> {window.electronAPI ? '✅ Disponível' : '❌ Indisponível'}
                    </div>
                    <div>
                        <strong>User Agent:</strong> {navigator.userAgent.split(' ')[0]}
                    </div>
                    <div>
                        <strong>Logs:</strong> {logs.length}/{maxLogs}
                    </div>
                </div>
            </div>

            {/* Logs */}
            <div className="flex-1 overflow-auto p-4">
                {logs.length === 0 ? (
                    <div className="text-gray-400 text-center py-8">
                        Nenhum log ainda. Execute alguma ação para ver os logs aqui.
                    </div>
                ) : (
                    <div className="space-y-1">
                        {logs.map((log, index) => (
                            <div key={index} className="font-mono text-xs border-l-2 border-gray-600 pl-3 py-1">
                                <div className="flex items-start gap-2">
                                    <span className="text-gray-500 min-w-0 flex-shrink-0">
                                        {log.timestamp}
                                    </span>
                                    <span className={`${getLogColor(log.type)} break-all`}>
                                        {log.message}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 p-3 border-t border-gray-600">
                <div className="flex gap-2 text-sm">
                    <button
                        onClick={() => console.log('📊 Status atual:', {
                            timestamp: new Date().toISOString(),
                            electronAPI: !!window.electronAPI,
                            location: window.location.href,
                            userAgent: navigator.userAgent
                        })}
                        className="bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded"
                    >
                        Log Status
                    </button>
                    <button
                        onClick={() => console.log('🔍 Window objects:', {
                            electronAPI: Object.keys(window.electronAPI || {}),
                            location: window.location,
                            navigator: {
                                userAgent: navigator.userAgent,
                                platform: navigator.platform
                            }
                        })}
                        className="bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded"
                    >
                        Log Window
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DebugMonitor;