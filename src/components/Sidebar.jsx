// src/components/Sidebar.jsx
import React, { useState } from 'react';

const Sidebar = ({ activeTab, setActiveTab, stats = {} }) => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [hasPin, setHasPin] = useState(false);
    const [isLocked, setIsLocked] = useState(false);

    // Mock user data - ajuste conforme necessário
    const user = {
        role: 'user', // ou 'admin'
        name: 'Usuário',
        avatar: null
    };

    const handleToggleLock = () => {
        setIsLocked(!isLocked);
    };

    const handleAdminAction = () => {
        console.log('Ação de admin executada');
    };

    const navigation = [
        {
            key: 'movies',
            label: 'Filmes',
            icon: '🎬',
            count: stats.movies || 0
        },
        {
            key: 'series',
            label: 'Séries',
            icon: '📺',
            count: stats.series || 0
        },
        {
            key: 'channels',
            label: 'Canais',
            icon: '📡',
            count: stats.channels || 0
        }
    ];

    return (
        <div className="w-64 bg-gray-800 h-screen flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-700">
                <h1 className="text-white text-xl font-bold flex items-center gap-2">
                    🦈 SharkTV
                </h1>
                
                {/* User Profile */}
                <div className="mt-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                        {user.avatar ? (
                            <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full" />
                        ) : (
                            <span className="text-white text-sm">👤</span>
                        )}
                    </div>
                    <div className="flex-1">
                        <p className="text-white text-sm font-medium">{user.name}</p>
                        <p className="text-gray-400 text-xs capitalize">{user.role}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2 flex-grow p-4">
                {/* Admin Section */}
                {user?.role === 'admin' && (
                    <div className="mb-4">
                        <button
                            onClick={handleAdminAction}
                            className="w-full text-left p-3 text-yellow-400 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <span>⚙️</span>
                            <span>Admin Panel</span>
                        </button>
                    </div>
                )}

                {/* Pin Lock */}
                {hasPin && (
                    <button 
                        onClick={handleToggleLock} 
                        className="w-full text-left p-3 text-orange-400 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2 mb-4"
                    >
                        <span>{isLocked ? '🔒' : '🔓'}</span>
                        <span>{isLocked ? 'Desbloqueado' : 'Bloqueado'}</span>
                    </button>
                )}

                {/* Main Navigation */}
                {navigation.map((item) => (
                    <button
                        key={item.key}
                        onClick={() => setActiveTab(item.key)}
                        className={`w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between ${
                            activeTab === item.key
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-lg">{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                            activeTab === item.key 
                                ? 'bg-blue-700 text-blue-100' 
                                : 'bg-gray-700 text-gray-300'
                        }`}>
                            {item.count}
                        </span>
                    </button>
                ))}

                {/* Additional Options */}
                <div className="mt-6 pt-4 border-t border-gray-700">
                    <button
                        onClick={() => setIsBlockModalOpen(true)}
                        className="w-full text-left p-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors flex items-center gap-3"
                    >
                        <span>🚫</span>
                        <span>Bloquear Categorias</span>
                    </button>
                    
                    <button
                        onClick={() => console.log('Configurações')}
                        className="w-full text-left p-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors flex items-center gap-3"
                    >
                        <span>⚙️</span>
                        <span>Configurações</span>
                    </button>
                </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-700">
                <div className="text-gray-400 text-xs text-center">
                    <p>SharkTV v1.0.0</p>
                    <p className="mt-1">
                        Status: {stats.movies || stats.series || stats.channels ? '🟢 Online' : '🔴 Carregando...'}
                    </p>
                </div>
            </div>

            {/* Modals - Comentados para não causar erro */}
            {/* 
            <ConfirmModal 
                isOpen={isConfirmModalOpen} 
                onConfirm={() => setIsConfirmModalOpen(false)} 
                onCancel={() => setIsConfirmModalOpen(false)} 
                title="Confirmar Ação"
                message="Tem certeza que deseja continuar?"
            />
            
            <BlockCategoriesModal 
                isOpen={isBlockModalOpen}
                onClose={() => setIsBlockModalOpen(false)}
                onSave={(blockedCategories) => {
                    console.log('Categorias bloqueadas:', blockedCategories);
                    setIsBlockModalOpen(false);
                }}
            />
            */}
        </div>
    );
};

export default Sidebar;