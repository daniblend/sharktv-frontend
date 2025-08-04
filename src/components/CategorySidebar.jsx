// src/components/CategorySidebar.jsx
import React, { useState } from 'react';

const CategorySidebar = ({ 
    categories = [], 
    selectedCategory, 
    onCategoryChange, 
    activeTab, 
    stats = {},
    onClearCache 
}) => {
    const [expandedSections, setExpandedSections] = useState({
        main: true,
        categories: true
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const getTabTitle = () => {
        switch (activeTab) {
            case 'movies': return 'Filmes';
            case 'series': return 'Séries';
            case 'channels': return 'Canais';
            default: return 'Conteúdo';
        }
    };

    const getUserProfile = () => {
        // Mock user data - substitua pela implementação real
        return {
            name: 'Daniel448814',
            connected: true
        };
    };

    const user = getUserProfile();

    return (
        <div className="w-72 bg-gray-800 h-screen overflow-y-auto border-r border-gray-700">
            {/* Header */}
            <div className="p-4 border-b border-gray-700">
                <h2 className="text-white text-lg font-semibold mb-2">SharkTV</h2>
                <p className="text-sm text-gray-400">Navegação por Filtros</p>
            </div>

            {/* User Profile */}
            <div className="p-4 border-b border-gray-700">
                <div className="mb-2">
                    <span className="text-sm font-medium text-gray-400">Perfil Conectado</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-white text-sm">Usuário: </span>
                    <span className="text-cyan-400 text-sm font-medium">{user.name}</span>
                </div>
            </div>

            {/* Main Navigation */}
            <div className="p-4">
                <button
                    onClick={() => toggleSection('main')}
                    className="flex items-center justify-between w-full text-white font-medium mb-3 hover:text-cyan-400 transition-colors"
                >
                    <span>{getTabTitle()}</span>
                    <svg 
                        className={`w-4 h-4 transform transition-transform ${expandedSections.main ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {expandedSections.main && (
                    <div className="ml-4 space-y-2">
                        <button
                            onClick={() => onCategoryChange('all')}
                            className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                selectedCategory === 'all'
                                    ? 'bg-cyan-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            Todos os Títulos
                        </button>

                        {/* Categorias específicas baseadas no tipo */}
                        {activeTab === 'movies' && (
                            <>
                                <button
                                    onClick={() => onCategoryChange('4k')}
                                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                        selectedCategory === '4k'
                                            ? 'bg-cyan-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    4K
                                </button>
                                <button
                                    onClick={() => onCategoryChange('legendado')}
                                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                        selectedCategory === 'legendado'
                                            ? 'bg-cyan-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    Legendado
                                </button>
                                <button
                                    onClick={() => onCategoryChange('dublado')}
                                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                        selectedCategory === 'dublado'
                                            ? 'bg-cyan-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    Dublado
                                </button>
                                <button
                                    onClick={() => onCategoryChange('cinema')}
                                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                        selectedCategory === 'cinema'
                                            ? 'bg-cyan-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    Cinema
                                </button>
                            </>
                        )}

                        {/* Gêneros dinâmicos */}
                        {categories.map((category) => (
                            <button
                                key={category.category_id || category.id}
                                onClick={() => onCategoryChange(category.category_id || category.id)}
                                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                    selectedCategory === (category.category_id || category.id)
                                        ? 'bg-cyan-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                            >
                                {category.category_name || category.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Séries Section (quando aplicável) */}
            {activeTab === 'series' && (
                <div className="px-4 pb-4">
                    <button
                        onClick={() => toggleSection('series')}
                        className="flex items-center justify-between w-full text-white font-medium mb-3 hover:text-cyan-400 transition-colors"
                    >
                        <span>Séries</span>
                        <svg 
                            className={`w-4 h-4 transform transition-transform ${expandedSections.series ? 'rotate-180' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {expandedSections.series && (
                        <div className="ml-4">
                            <button className="block w-full text-left px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                                Em Andamento
                            </button>
                            <button className="block w-full text-left px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                                Finalizadas
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Minha Lista Section */}
            <div className="px-4 pb-4">
                <button className="flex items-center justify-between w-full text-white font-medium mb-3 hover:text-cyan-400 transition-colors">
                    <span>Minha Lista</span>
                </button>
                <div className="ml-4">
                    <button className="block w-full text-left px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                        Favoritos
                    </button>
                    <button className="block w-full text-left px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                        Assistir Mais Tarde
                    </button>
                    <button className="block w-full text-left px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                        Continuar Assistindo
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="px-4 pb-4 border-t border-gray-700 pt-4">
                <div className="text-sm text-gray-400 space-y-1">
                    <div className="flex justify-between">
                        <span>Filmes:</span>
                        <span className="text-cyan-400">{stats.movies || 0}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Séries:</span>
                        <span className="text-cyan-400">{stats.series || 0}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Canais:</span>
                        <span className="text-cyan-400">{stats.channels || 0}</span>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="px-4 pb-4 border-t border-gray-700 pt-4 mt-auto">
                <button
                    onClick={onClearCache}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm transition-colors mb-2"
                >
                    Limpar Cache
                </button>
                <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
                    Sair
                </button>
            </div>
        </div>
    );
};

export default CategorySidebar;