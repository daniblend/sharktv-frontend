import React, { createContext, useState, useContext, useMemo } from 'react';

const FilterContext = createContext(null);

export const FilterProvider = ({ children }) => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isFilterPanelVisible, setIsFilterPanelVisible] = useState(true); // Começa aberto

    const toggleFilterPanel = () => {
        setIsFilterPanelVisible(prev => !prev);
    };

    const value = useMemo(() => ({
        selectedCategory,
        setSelectedCategory,
        isFilterPanelVisible,
        toggleFilterPanel
    }), [selectedCategory, isFilterPanelVisible]);

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