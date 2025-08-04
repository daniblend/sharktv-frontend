// src/components/SettingsSidebar.jsx
import React, { useState } from 'react';

const SettingsSidebar = ({ isOpen, onClose, onClearCache, lastUpdated, stats }) => {
    const [showUserEdit, setShowUserEdit] = useState(false);
    const [showListManagement, setShowListManagement] = useState(false);
    const [showParentalControl, setShowParentalControl] = useState(false);

    // Mock user data - substitua pela implementação real
    const [userData, setUserData] = useState({
        name: 'Usuário',
        email: 'usuario@exemplo.com',
        profile: 'default'
    });

    const [parentalSettings, setParentalSettings] = useState({
        adultContentBlocked: false,
        pinEnabled: false,
        pin: '1234'
    });

    const handleClearCache = () => {
        if (confirm('Tem certeza que deseja limpar o cache? Isso recarregará todos os dados.')) {
            onClearCache?.();
            alert('Cache limpo com sucesso!');
        }
    };

    const handleSaveUser = (newUserData) => {
        setUserData(newUserData);
        setShowUserEdit(false);
        alert('Dados do usuário salvos com sucesso!');
    };

    const handleParentalControlSave = (newSettings) => {
        setParentalSettings(newSettings);
        alert('Configurações de controle parental salvas!');
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className="fixed left-0 top-0 h-full w-80 bg-gray-800 z-50 transform transition-transform duration-300 overflow-y-auto">
                {/* Header */}
                <div className="bg-gray-900 p-4 flex items-center justify-between border-b border-gray-700">
                    <h2 className="text-white text-lg font-bold flex items-center gap-2">
                        ⚙️ Configurações
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white p-1 rounded"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* System Status */}
                    <div className="bg-gray-700 rounded-lg p-4">
                        <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                            📊 Status do Sistema
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-300">
                                <span>Filmes:</span>
                                <span className="text-blue-400">{stats?.movies || 0}</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                                <span>Séries:</span>
                                <span className="text-blue-400">{stats?.series || 0}</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                                <span>Canais:</span>
                                <span className="text-blue-400">{stats?.channels || 0}</span>
                            </div>
                            {lastUpdated && (
                                <div className="flex justify-between text-gray-300 pt-2 border-t border-gray-600">
                                    <span>Última atualização:</span>
                                    <span className="text-green-400 text-xs">
                                        {lastUpdated.toLocaleString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Cache Management */}
                    <div className="bg-gray-700 rounded-lg p-4">
                        <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                            🗑️ Gerenciar Cache
                        </h3>
                        <p className="text-gray-300 text-sm mb-3">
                            Limpar o cache força o recarregamento de todos os dados do servidor.
                        </p>
                        <button
                            onClick={handleClearCache}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                            Limpar Cache
                        </button>
                    </div>

                    {/* User Data */}
                    <div className="bg-gray-700 rounded-lg p-4">
                        <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                            👤 Dados do Usuário
                        </h3>
                        <div className="space-y-2 text-sm mb-3">
                            <div className="flex justify-between text-gray-300">
                                <span>Nome:</span>
                                <span>{userData.name}</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                                <span>Email:</span>
                                <span>{userData.email}</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                                <span>Perfil:</span>
                                <span className="capitalize">{userData.profile}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowUserEdit(true)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                            Editar Dados
                        </button>
                    </div>

                    {/* List Management */}
                    <div className="bg-gray-700 rounded-lg p-4">
                        <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                            📋 Gerenciar Listas
                        </h3>
                        <p className="text-gray-300 text-sm mb-3">
                            Configure quais listas de conteúdo devem ser exibidas.
                        </p>
                        <button
                            onClick={() => setShowListManagement(true)}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                            Configurar Listas
                        </button>
                    </div>

                    {/* Parental Control */}
                    <div className="bg-gray-700 rounded-lg p-4">
                        <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                            🔒 Controle Parental
                        </h3>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 text-gray-300">
                                <input
                                    type="checkbox"
                                    checked={parentalSettings.adultContentBlocked}
                                    onChange={(e) => setParentalSettings(prev => ({
                                        ...prev,
                                        adultContentBlocked: e.target.checked
                                    }))}
                                    className="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm">Bloquear conteúdo adulto</span>
                            </label>
                            
                            <label className="flex items-center gap-3 text-gray-300">
                                <input
                                    type="checkbox"
                                    checked={parentalSettings.pinEnabled}
                                    onChange={(e) => setParentalSettings(prev => ({
                                        ...prev,
                                        pinEnabled: e.target.checked
                                    }))}
                                    className="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm">Ativar PIN parental</span>
                            </label>
                        </div>
                        
                        <button
                            onClick={() => setShowParentalControl(true)}
                            className="w-full mt-3 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                            Configurar PIN
                        </button>
                    </div>

                    {/* App Info */}
                    <div className="bg-gray-700 rounded-lg p-4">
                        <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                            ℹ️ Informações do App
                        </h3>
                        <div className="space-y-2 text-sm text-gray-300">
                            <div className="flex justify-between">
                                <span>Versão:</span>
                                <span>1.0.0</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Desenvolvido por:</span>
                                <span>SharkTV Team</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Edit Modal */}
            {showUserEdit && (
                <UserEditModal 
                    userData={userData}
                    onSave={handleSaveUser}
                    onClose={() => setShowUserEdit(false)}
                />
            )}

            {/* List Management Modal */}
            {showListManagement && (
                <ListManagementModal 
                    onClose={() => setShowListManagement(false)}
                />
            )}

            {/* Parental Control Modal */}
            {showParentalControl && (
                <ParentalControlModal 
                    settings={parentalSettings}
                    onSave={handleParentalControlSave}
                    onClose={() => setShowParentalControl(false)}
                />
            )}
        </>
    );
};

// Modal para editar dados do usuário
const UserEditModal = ({ userData, onSave, onClose }) => {
    const [formData, setFormData] = useState(userData);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-60 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg w-full max-w-md">
                <div className="p-4 border-b border-gray-700">
                    <h3 className="text-white text-lg font-medium">Editar Dados do Usuário</h3>
                </div>
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-gray-300 text-sm mb-2">Nome</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 text-sm mb-2">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                            Salvar
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Modal para gerenciar listas
const ListManagementModal = ({ onClose }) => {
    const [lists, setLists] = useState([
        { id: 1, name: 'Lista Principal', enabled: true, adult: false },
        { id: 2, name: 'Conteúdo Adulto', enabled: false, adult: true },
        { id: 3, name: 'Kids Zone', enabled: true, adult: false }
    ]);

    const toggleList = (id) => {
        setLists(prev => prev.map(list => 
            list.id === id ? { ...list, enabled: !list.enabled } : list
        ));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-60 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg w-full max-w-md">
                <div className="p-4 border-b border-gray-700">
                    <h3 className="text-white text-lg font-medium">Gerenciar Listas</h3>
                </div>
                <div className="p-4">
                    <div className="space-y-3">
                        {lists.map(list => (
                            <div key={list.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                                <div>
                                    <span className="text-white font-medium">{list.name}</span>
                                    {list.adult && (
                                        <span className="ml-2 text-xs bg-red-600 text-white px-2 py-1 rounded">
                                            18+
                                        </span>
                                    )}
                                </div>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={list.enabled}
                                        onChange={() => toggleList(list.id)}
                                        className="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                                    />
                                </label>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={onClose}
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

// Modal para controle parental
const ParentalControlModal = ({ settings, onSave, onClose }) => {
    const [formData, setFormData] = useState(settings);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-60 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg w-full max-w-md">
                <div className="p-4 border-b border-gray-700">
                    <h3 className="text-white text-lg font-medium">Controle Parental</h3>
                </div>
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-gray-300 text-sm mb-2">PIN Parental</label>
                        <input
                            type="password"
                            value={formData.pin}
                            onChange={(e) => setFormData(prev => ({ ...prev, pin: e.target.value }))}
                            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                            maxLength={4}
                            placeholder="Digite 4 números"
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                            Salvar PIN
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsSidebar;