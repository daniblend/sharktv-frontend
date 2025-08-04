// src/components/MovieGrid.jsx
import React from 'react';

const MovieGrid = ({ 
    items = [], 
    type, 
    selectedCategory = 'all', 
    searchTerm = '', 
    onItemClick 
}) => {
    // Filtra itens por categoria e busca
    const filteredItems = items.filter(item => {
        // Filtro por categoria
        let matchesCategory = true;
        if (selectedCategory !== 'all') {
            if (selectedCategory === '4k') {
                matchesCategory = item.name?.toLowerCase().includes('4k') || 
                                item.title?.toLowerCase().includes('4k') ||
                                item.stream_type?.toLowerCase().includes('4k');
            } else if (selectedCategory === 'legendado') {
                matchesCategory = item.name?.toLowerCase().includes('leg') || 
                                item.name?.toLowerCase().includes('legendado');
            } else if (selectedCategory === 'dublado') {
                matchesCategory = item.name?.toLowerCase().includes('dub') || 
                                item.name?.toLowerCase().includes('dublado');
            } else if (selectedCategory === 'cinema') {
                matchesCategory = item.name?.toLowerCase().includes('cinema') || 
                                item.category_name?.toLowerCase().includes('cinema');
            } else {
                matchesCategory = item.category_id === selectedCategory ||
                                item.category === selectedCategory;
            }
        }
        
        // Filtro por busca
        const matchesSearch = searchTerm === '' || 
                            item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.title?.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesCategory && matchesSearch;
    });

    const getItemImage = (item) => {
        return item.stream_icon || item.icon || item.image || null;
    };

    const getItemTitle = (item) => {
        return item.name || item.title || 'Sem título';
    };

    const getItemYear = (item) => {
        if (item.year) return item.year;
        
        // Tenta extrair ano do título
        const yearMatch = getItemTitle(item).match(/\((\d{4})\)/);
        return yearMatch ? yearMatch[1] : null;
    };

    if (filteredItems.length === 0) {
        return (
            <div className="text-center text-gray-400 py-16">
                <div className="text-6xl mb-4">
                    {type === 'movie' ? '🎬' : 
                     type === 'series' ? '📺' : 
                     type === 'live' ? '📡' : '🎥'}
                </div>
                {searchTerm || selectedCategory !== 'all' ? (
                    <>
                        <p className="text-xl mb-2">Nenhum resultado encontrado</p>
                        <p className="text-sm mb-4">Tente ajustar os filtros de busca</p>
                    </>
                ) : (
                    <>
                        <p className="text-xl mb-2">Nenhum conteúdo disponível</p>
                        <p className="text-sm">Aguarde o carregamento dos dados</p>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredItems.map((item, index) => (
                <div
                    key={item.stream_id || item.id || index}
                    className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-all duration-300 cursor-pointer group hover:scale-105 hover:shadow-2xl"
                    onClick={() => onItemClick(item)}
                >
                    {/* Poster - Formato landscape mais próximo do original */}
                    <div className="aspect-[3/4] bg-gray-700 flex items-center justify-center relative overflow-hidden">
                        {getItemImage(item) ? (
                            <img 
                                src={getItemImage(item)} 
                                alt={getItemTitle(item)}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                        ) : null}
                        
                        {/* Fallback placeholder */}
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-700 to-gray-800">
                            <div className="text-4xl mb-2">
                                {type === 'movie' ? '🎬' : 
                                 type === 'series' ? '📺' : 
                                 type === 'live' ? '📡' : '🎥'}
                            </div>
                            <div className="text-xs text-center px-2 leading-tight">
                                {getItemTitle(item).substring(0, 20)}
                                {getItemTitle(item).length > 20 ? '...' : ''}
                            </div>
                        </div>
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <div className="text-center text-white">
                                <div className="text-4xl mb-2">▶️</div>
                                <div className="text-sm font-medium">Reproduzir</div>
                            </div>
                        </div>
                        
                        {/* Quality badge */}
                        {(item.name?.toLowerCase().includes('4k') || item.title?.toLowerCase().includes('4k')) && (
                            <div className="absolute top-2 right-2 bg-yellow-600 bg-opacity-90 text-white text-xs px-2 py-1 rounded backdrop-blur-sm font-semibold">
                                4K
                            </div>
                        )}

                        {/* Language badge */}
                        {item.name?.toLowerCase().includes('dub') && (
                            <div className="absolute top-2 left-2 bg-green-600 bg-opacity-90 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                                DUB
                            </div>
                        )}
                        {item.name?.toLowerCase().includes('leg') && (
                            <div className="absolute top-2 left-2 bg-blue-600 bg-opacity-90 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                                LEG
                            </div>
                        )}

                        {/* Rating badge */}
                        {item.rating && parseFloat(item.rating) > 0 && (
                            <div className="absolute bottom-2 left-2 bg-yellow-600 bg-opacity-90 text-white text-xs px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1">
                                ⭐ {parseFloat(item.rating).toFixed(1)}
                            </div>
                        )}
                    </div>
                    
                    {/* Title Info */}
                    <div className="p-3">
                        <h3 className="text-white text-sm font-medium leading-tight mb-1 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                            {getItemTitle(item)}
                        </h3>
                        
                        {/* Metadata */}
                        <div className="flex items-center justify-between text-xs text-gray-400">
                            <div className="flex items-center gap-2">
                                {getItemYear(item) && (
                                    <span>{getItemYear(item)}</span>
                                )}
                                {item.duration && (
                                    <span>{item.duration}min</span>
                                )}
                            </div>
                            
                            {/* Type indicator */}
                            <div className="text-gray-500">
                                {type === 'movie' ? 'Filme' : 
                                 type === 'series' ? 'Série' : 
                                 type === 'live' ? 'TV' : 'Mídia'}
                            </div>
                        </div>

                        {/* Category */}
                        {item.category_name && (
                            <div className="text-xs text-gray-500 mt-1 truncate">
                                {item.category_name}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MovieGrid;