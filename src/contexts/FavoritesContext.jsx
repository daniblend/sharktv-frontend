// --- ARQUIVO COMPLETO E FINAL: src/contexts/FavoritesContext.jsx ---

import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState(() => {
        try {
            const localData = localStorage.getItem('sharktv-favorites');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Erro ao carregar favoritos do localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('sharktv-favorites', JSON.stringify(favorites));
        } catch (error) {
            console.error("Erro ao salvar favoritos no localStorage", error);
        }
    }, [favorites]);

    const addFavorite = (item) => {
        if (!favorites.some(fav => fav.title === item.title)) {
            setFavorites((prev) => [item, ...prev]);
            toast.success(`"${item.title}" adicionado aos favoritos!`);
        } else {
            toast.error(`"${item.title}" já está nos seus favoritos.`);
        }
    };

    const removeFavorite = (itemTitle) => {
        setFavorites((prev) => prev.filter(fav => fav.title !== itemTitle));
        toast.error(`"${itemTitle}" removido dos favoritos.`);
    };

    const isFavorite = (itemTitle) => {
        return favorites.some(fav => fav.title === itemTitle);
    };

    const value = { favorites, addFavorite, removeFavorite, isFavorite };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};