// src/components/ContentGrid.jsx - Integrado com componentes existentes
import React, { useRef } from 'react';
import { useFilters } from '../contexts/FilterContext';
import { useSpatialNavigation } from '../hooks/useSpatialNavigation';
import Card from './Card';

const ContentGrid = ({ items = [], searchTerm = '', onItemClick }) => {
    const containerRef = useRef(null);
    const { selectedCategory } = useFilters();
    
    // Ativa navegação espacial para controle remoto/gamepad
    useSpatialNavigation(containerRef, { enabled: true, initialFocus: false });

    // Filtra itens baseado na busca e categoria selecionada
    const filteredItems = items.filter(item => {
        // Filtro por categoria
        let matchesCategory = true;
        if (selectedCategory && selectedCategory !== 'all' && selectedCategory !== 'Todos') {
            // Verifica se corresponde à categoria selecionada
            matchesCategory = item.group === selectedCategory || 
                            item.category_name === selectedCategory ||
                            item.title?.toLowerCase().includes(selectedCategory.toLowerCase());
        }

        // Filtro por busca
        const matchesSearch = !searchTerm || 
                            item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.name?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    // Loading skeleton
    const renderSkeleton = () => (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10">
            {[...Array(18)].map((_, i) => (
                <div key={i} className="animate-pulse">
                    <div className="w-full aspect-[2/3] bg-gray-700 rounded-md"></div>
                    <div className="mt-2 h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
            ))}
        </div>
    );

    // Estado vazio
    if (!items || items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-6xl mb-4">🎬</div>
                <h3 className="text-white text-xl font-semibold mb-2">Carregando conteúdo...</h3>
                <p className="text-gray-400">Aguarde enquanto buscamos seus filmes e séries</p>
                {renderSkeleton()}
            </div>
        );
    }

    // Nenhum resultado encontrado
    if (filteredItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-white text-xl font-semibold mb-2">Nenhum resultado encontrado</h3>
                <p className="text-gray-400 mb-4">
                    {searchTerm 
                        ? `Não encontramos nada para "${searchTerm}"`
                        : selectedCategory !== 'all' && selectedCategory !== 'Todos'
                        ? `Nenhum item na categoria "${selectedCategory}"`
                        : 'Nenhum conteúdo disponível'
                    }
                </p>
                {(searchTerm || (selectedCategory !== 'all' && selectedCategory !== 'Todos')) && (
                    <button
                        onClick={() => {
                            // Reset filters - você pode implementar isso no contexto
                            window.location.reload(); // Solução temporária
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Ver todos os itens
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Header com contadores */}
            <div className="mb-6 flex justify-between items-center">
                <div className="text-white">
                    <h2 className="text-2xl font-bold">
                        {searchTerm ? `Resultados para "${searchTerm}"` : 
                         selectedCategory && selectedCategory !== 'all' && selectedCategory !== 'Todos' ? 
                         `Categoria: ${selectedCategory}` : 'Todo o conteúdo'}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                        {filteredItems.length} {filteredItems.length === 1 ? 'item encontrado' : 'itens encontrados'}
                    </p>
                </div>
            </div>

            {/* Grid de cards */}
            <div 
                ref={containerRef}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10"
            >
                {filteredItems.map((item, index) => (
                    <Card
                        key={item.stream_id || item.id || index}
                        item={item}
                        onCardClick={onItemClick}
                    />
                ))}
            </div>

            {/* Indicador de mais conteúdo */}
            {filteredItems.length >= 100 && (
                <div className="text-center py-8">
                    <p className="text-gray-400 text-sm">
                        Mostrando primeiros {filteredItems.length} resultados
                    </p>
                </div>
            )}
        </div>
    );
};

export default ContentGrid;