// src/pages/PlayerPage.jsx - Usando seus componentes originais
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIPTVCache } from '../hooks/useIPTVCache';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ContentGrid from '../components/ContentGrid';
import DetailsModal from '../components/DetailsModal';
import LoadingScreen from '../components/LoadingScreen';
import SeriesDetails from '../components/SeriesDetails';

const PlayerPage = () => {
    const navigate = useNavigate();
    
    // Estados do layout original
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('Filmes');
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    
    // Hook de cache
    const { data, loading, error, lastUpdated, loadAllData, clearCache, buildStreamUrl } = useIPTVCache();

    // Mapeia os dados para o formato esperado pelos componentes originais
    const getProcessedData = () => {
        const activeData = getActiveData();
        return activeData.items.map(item => ({
            ...item,
            // Padroniza campos para compatibilidade
            title: item.name || item.title || 'Sem título',
            logo: item.stream_icon || item.icon || item.image,
            group: item.category_name || 'Geral',
            type: activeData.type,
            // Adiciona campos extras se necessário
            tmdb_id: item.tmdb_id || '0',
            year: item.year || extractYear(item.name || item.title),
            rating: item.rating || 0
        }));
    };

    // Extrai ano do título se disponível
    const extractYear = (title) => {
        if (!title) return null;
        const yearMatch = title.match(/\((\d{4})\)/);
        return yearMatch ? yearMatch[1] : null;
    };

    // Função para obter categorias únicas
    const getCategories = () => {
        const activeData = getActiveData();
        const categories = ['all'];
        
        // Adiciona categorias do tipo atual
        activeData.categories.forEach(cat => {
            const categoryName = cat.category_name || cat.name;
            if (categoryName && !categories.includes(categoryName)) {
                categories.push(categoryName);
            }
        });

        return categories;
    };

    const getActiveData = () => {
        switch (activeMenu) {
            case 'Filmes':
                return {
                    items: data.movies || [],
                    categories: data.movieCategories || [],
                    type: 'movie'
                };
            case 'Séries':
                return {
                    items: data.series || [],
                    categories: data.seriesCategories || [],
                    type: 'series'
                };
            case 'Canais':
                return {
                    items: data.channels || [],
                    categories: data.channelCategories || [],
                    type: 'live'
                };
            default:
                return { items: [], categories: [], type: 'movie' };
        }
    };

    const handlePlayContent = (item) => {
        try {
            const activeData = getActiveData();
            const streamUrl = buildStreamUrl(item, activeData.type);
            
            if (!streamUrl) {
                throw new Error('Não foi possível gerar a URL do stream');
            }

            console.log('🚀 Navegando para o player...', { 
                type: activeData.type, 
                title: item.title || item.name,
                streamId: item.stream_id 
            });
            
            const searchParams = new URLSearchParams({
                url: streamUrl,
                type: activeData.type,
                title: item.title || item.name || 'Sem título'
            });

            navigate(`/player?${searchParams.toString()}`);

        } catch (error) {
            console.error('❌ Erro ao reproduzir conteúdo:', error);
            alert(`Erro ao reproduzir: ${error.message}`);
        }
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
        setShowDetailsModal(true);
    };

    const handleLogout = () => {
        // Implementar logout se necessário
        console.log('Logout clicked');
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleToggleSearch = () => {
        setIsSearchVisible(!isSearchVisible);
        if (!isSearchVisible) {
            setSearchTerm('');
        }
    };

    const handleToggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleMenuChange = (menu) => {
        setActiveMenu(menu);
        // Reset outros estados quando muda de menu
        setSearchTerm('');
        setSelectedItem(null);
        setShowDetailsModal(false);
    };

    // Loading state
    if (loading) {
        return <LoadingScreen message="Carregando SharkTV..." />;
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center text-white max-w-md mx-auto p-6">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold mb-4">Erro de Conexão</h2>
                    <p className="text-gray-300 mb-6">{error}</p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => loadAllData(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                        >
                            Tentar Novamente
                        </button>
                        <button
                            onClick={() => {
                                clearCache();
                                loadAllData(true);
                            }}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
                        >
                            Limpar Cache
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const processedData = getProcessedData();

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-shark-bg, #1a1a1a)' }}>
            {/* Header Original */}
            <Header
                onToggleSidebar={handleToggleSidebar}
                activeMenu={activeMenu}
                onMenuChange={handleMenuChange}
                categories={getCategories()}
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                isSearchVisible={isSearchVisible}
                onToggleSearch={handleToggleSearch}
                onLogout={handleLogout}
            />

            {/* Sidebar Original */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Content Grid Original */}
            <main className="pt-24">
                <div className="container mx-auto px-4">
                    <ContentGrid
                        items={processedData}
                        searchTerm={searchTerm}
                        onItemClick={handleItemClick}
                    />
                </div>
            </main>

            {/* Details Modal Original Reativado */}
            {showDetailsModal && selectedItem && (
                selectedItem.type === 'series' ? (
                    <SeriesDetails
                        item={selectedItem}
                        onClose={() => {
                            setShowDetailsModal(false);
                            setSelectedItem(null);
                        }}
                        onPlayEpisode={(episodeData) => {
                            // Navega para o player com dados do episódio
                            const searchParams = new URLSearchParams({
                                url: episodeData.url,
                                type: 'series',
                                title: episodeData.title
                            });
                            navigate(`/player?${searchParams.toString()}`);
                            setShowDetailsModal(false);
                        }}
                    />
                ) : (
                    <DetailsModal
                        item={selectedItem}
                        onClose={() => {
                            setShowDetailsModal(false);
                            setSelectedItem(null);
                        }}
                        onPlay={handlePlayContent}
                    />
                )
            )}

            {/* Status da aplicação (opcional) */}
            {lastUpdated && (
                <div className="fixed bottom-4 right-4 bg-black bg-opacity-50 text-white text-xs px-3 py-1 rounded-full">
                    Cache: {lastUpdated.toLocaleTimeString()}
                </div>
            )}
        </div>
    );
};

export default PlayerPage;