// --- NOVO ARQUIVO COMPLETO: src/components/FilterPanel.jsx ---

import React from 'react';

const FilterPanel = ({ isVisible, categories = [], selectedCategoryId, onSelectCategory }) => {
    const fullCategoriesList = [ { category_id: 'all', category_name: 'Todos' }, ...categories ];

    return (
        <div className={`sticky-filter transition-all duration-300 ease-in-out overflow-hidden mb-8 ${isVisible ? 'max-h-40 py-4' : 'max-h-0'}`}>
            <div className="px-4 sm:px-8">
                <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
                    {fullCategoriesList.map(category => (
                        <button
                            key={category.category_id}
                            tabIndex={isVisible ? 0 : -1}
                            onClick={() => onSelectCategory(category.category_id)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full flex-shrink-0 transition-colors duration-200 ${String(selectedCategoryId) === String(category.category_id) ? 'bg-sharkBlue text-black' : 'bg-sharkSurface hover:bg-sharkBg/70 text-gray-300'}`}
                        >
                            {category.category_name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FilterPanel;