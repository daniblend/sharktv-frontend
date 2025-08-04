// src/components/DetailModal.jsx
import React from 'react';

const DetailModal = ({ item, type, onClose, onPlay }) => {
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

    const getQualityBadge = (item) => {
        const title = getItemTitle(item).toLowerCase();
        if (title.includes('4k')) return '4K';
        if (title.includes('hd')) return 'HD';
        if (title.includes('fhd')) return 'FHD';
        return null;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header com botão fechar */}
                <div className="relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex gap-6 p-6">
                    {/* Poster */}
                    <div className="flex-shrink-0">
                        <div className="w-48 aspect-[3/4] bg-gray-700 rounded-lg overflow-hidden">
                            {getItemImage(item) ? (
                                <img 
                                    src={getItemImage(item)} 
                                    alt={getItemTitle(item)}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                            ) : null}
                            
                            {/* Fallback */}
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-700 to-gray-800">
                                <div className="text-6xl mb-4">
                                    {type === 'movie' ? '🎬' : 
                                     type === 'series' ? '📺' : 
                                     type === 'live' ? '📡' : '🎥'}
                                </div>
                                <div className="text-sm text-center px-4 leading-tight">
                                    {getItemTitle(item)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        {/* Title and Quality */}
                        <div className="mb-4">
                            <h2 className="text-white text-2xl font-bold mb-2 leading-tight">
                                {getItemTitle(item)}
                                {getQualityBadge(item) && (
                                    <span className="ml-3 text-yellow-400 text-lg">
                                        {getQualityBadge(item)}
                                    </span>
                                )}
                            </h2>
                            
                            {/* Metadata */}
                            <div className="flex items-center gap-4 text-gray-400 text-sm">
                                {getItemYear(item) && (
                                    <span>{getItemYear(item)}</span>
                                )}
                                {item.duration && (
                                    <span>{item.duration} min</span>
                                )}
                                {item.rating && parseFloat(item.rating) > 0 && (
                                    <div className="flex items-center gap-1">
                                        <span>⭐</span>
                                        <span>{parseFloat(item.rating).toFixed(1)}</span>
                                    </div>
                                )}
                                <span className="capitalize">
                                    {type === 'movie' ? 'Filme' : 
                                     type === 'series' ? 'Série' : 
                                     type === 'live' ? 'Canal de TV' : 'Mídia'}
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <p className="text-gray-300 text-sm leading-relaxed">
                                {item.plot || item.description || item.desc || 
                                 'Detalhes não disponíveis para este título.'}
                            </p>
                        </div>

                        {/* Additional Info */}
                        <div className="space-y-3 mb-6">
                            {item.genre && (
                                <div>
                                    <span className="text-gray-400 text-sm">Gênero: </span>
                                    <span className="text-white text-sm">{item.genre}</span>
                                </div>
                            )}
                            
                            {item.director && (
                                <div>
                                    <span className="text-gray-400 text-sm">Diretor: </span>
                                    <span className="text-white text-sm">{item.director}</span>
                                </div>
                            )}
                            
                            {item.cast && (
                                <div>
                                    <span className="text-gray-400 text-sm">Elenco: </span>
                                    <span className="text-white text-sm">{item.cast}</span>
                                </div>
                            )}

                            {item.category_name && (
                                <div>
                                    <span className="text-gray-400 text-sm">Categoria: </span>
                                    <span className="text-white text-sm">{item.category_name}</span>
                                </div>
                            )}

                            {/* Para canais de TV */}
                            {type === 'live' && item.epg_channel_id && (
                                <div>
                                    <span className="text-gray-400 text-sm">Canal ID: </span>
                                    <span className="text-white text-sm">{item.epg_channel_id}</span>
                                </div>
                            )}
                        </div>

                        {/* Language and Quality badges */}
                        <div className="flex gap-2 mb-6">
                            {getItemTitle(item).toLowerCase().includes('dub') && (
                                <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                                    Dublado
                                </span>
                            )}
                            {getItemTitle(item).toLowerCase().includes('leg') && (
                                <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                                    Legendado
                                </span>
                            )}
                            {getQualityBadge(item) && (
                                <span className="bg-yellow-600 text-white text-xs px-3 py-1 rounded-full">
                                    {getQualityBadge(item)}
                                </span>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={onPlay}
                                className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                                Play Media
                            </button>
                            
                            <button className="flex items-center gap-2 bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                + Favoritos
                            </button>
                        </div>

                        {/* Technical Info */}
                        {(item.stream_type || item.container_extension) && (
                            <div className="mt-6 pt-4 border-t border-gray-700">
                                <div className="text-gray-400 text-xs space-y-1">
                                    {item.stream_type && (
                                        <div>Formato: {item.stream_type.toUpperCase()}</div>
                                    )}
                                    {item.container_extension && (
                                        <div>Extensão: {item.container_extension.toUpperCase()}</div>
                                    )}
                                    {item.stream_id && (
                                        <div>ID: {item.stream_id}</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailModal;