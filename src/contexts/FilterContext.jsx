// src/contexts/FilterContext.jsx - Contexto para filtros
import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isFilterPanelVisible, setIsFilterPanelVisible] = useState(false);

    const toggleFilterPanel = () => {
        setIsFilterPanelVisible(prev => !prev);
    };

    const resetFilters = () => {
        setSelectedCategory('all');
        setIsFilterPanelVisible(false);
    };

    const value = {
        selectedCategory,
        setSelectedCategory,
        isFilterPanelVisible,
        setIsFilterPanelVisible,
        toggleFilterPanel,
        resetFilters
    };

    return (
        <FilterContext.Provider value={value}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilters = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error('useFilters deve ser usado dentro de um FilterProvider');
    }
    return context;
};