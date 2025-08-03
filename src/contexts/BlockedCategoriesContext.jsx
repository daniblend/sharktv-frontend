// --- NOVO ARQUIVO: src/contexts/BlockedCategoriesContext.jsx ---

import React, { createContext, useState, useContext, useEffect } from 'react';

const BlockedCategoriesContext = createContext();

export const useBlockedCategories = () => useContext(BlockedCategoriesContext);

const LOCAL_STORAGE_KEY = 'sharktv-blocked-categories';

export const BlockedCategoriesProvider = ({ children }) => {
    const [blockedCategories, setBlockedCategories] = useState(() => {
        try {
            const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Erro ao carregar categorias bloqueadas", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(blockedCategories));
        } catch (error) {
            console.error("Erro ao salvar categorias bloqueadas", error);
        }
    }, [blockedCategories]);

    const toggleBlockCategory = (categoryId) => {
        setBlockedCategories((prev) => {
            const isBlocked = prev.includes(categoryId);
            if (isBlocked) {
                return prev.filter(id => id !== categoryId); // Desbloqueia
            } else {
                return [...prev, categoryId]; // Bloqueia
            }
        });
    };

    const isCategoryBlocked = (categoryId) => {
        return blockedCategories.includes(categoryId);
    };

    const value = { blockedCategories, toggleBlockCategory, isCategoryBlocked };

    return (
        <BlockedCategoriesContext.Provider value={value}>
            {children}
        </BlockedCategoriesContext.Provider>
    );
};