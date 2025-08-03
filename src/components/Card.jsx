// --- ARQUIVO COMPLETO E FINAL: src/components/Card.jsx ---

import React from 'react';
import { useFavorites } from '../contexts/FavoritesContext';

const Card = ({ item, onCardClick }) => {
    const { isFavorite } = useFavorites();
    const isFav = isFavorite(item.title);

    return (
        <div
            onClick={() => onCardClick(item)}
            tabIndex="0"
            className="group/card relative w-full aspect-[2/3] bg-sharkSurface rounded-md overflow-hidden cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:z-10 hover:shadow-lg hover:shadow-black/50 focus:outline-none focus:ring-4 focus:ring-sharkBlue"
            onKeyDown={(e) => { if (e.key === 'Enter') onCardClick(item); }}
        >
            {isFav && (
                <div className="absolute top-2 right-2 z-20 bg-sharkRed rounded-full p-1.5" title="Nos seus Favoritos">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                </div>
            )}
            <img src={item.logo} alt={item.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/logo.png'; }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <p className="text-white font-bold truncate">{item.title}</p>
            </div>
        </div>
    );
};

export default Card;