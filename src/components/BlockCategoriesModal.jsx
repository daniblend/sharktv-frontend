// --- ARQUIVO COMPLETO E FINAL: src/components/BlockCategoriesModal.jsx ---

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useBlockedCategories } from '../contexts/BlockedCategoriesContext';
import { useParentalControl } from '../contexts/ParentalControlContext';

const fetchAllCategories = async () => {
    try {
        const [live, movies, series] = await Promise.all([
            api.get('/api/categories/live'),
            api.get('/api/categories/movie'),
            api.get('/api/categories/series'),
        ]);
        return {
            Canais: live.data || [],
            Filmes: movies.data || [],
            Séries: series.data || [],
        };
    } catch (error) {
        console.error("Falha ao buscar todas as categorias para bloqueio", error);
        toast.error("Não foi possível carregar as categorias.");
        return { Canais: [], Filmes: [], Séries: [] };
    }
};

const BlockCategoriesModal = ({ isOpen, onClose }) => {
    const { data: allCategories, isLoading } = useQuery({
        queryKey: ['allCategoriesForBlocking'],
        queryFn: fetchAllCategories,
        enabled: isOpen,
    });

    const { blockedCategories, setBlockedCategories } = useBlockedCategories();
    const { requestPin } = useParentalControl();
    
    const [localBlocked, setLocalBlocked] = useState([]);

    useEffect(() => {
        if (isOpen) {
            setLocalBlocked(blockedCategories);
        }
    }, [isOpen, blockedCategories]);

    const handleToggle = (categoryId) => {
        setLocalBlocked(prev => {
            if (prev.includes(categoryId)) {
                return prev.filter(id => id !== categoryId);
            }
            return [...prev, categoryId];
        });
    };

    const handleSaveChanges = () => {
        const saveAction = () => {
            setBlockedCategories(localBlocked);
            toast.success('Lista de bloqueio atualizada!');
            onClose();
        };
        requestPin(saveAction);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="relative w-full h-full max-w-lg max-h-[80vh] bg-sharkSurface rounded-lg shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">Bloquear Categorias</h2>
                    <button onClick={onClose} className="text-3xl hover:text-sharkBlue">×</button>
                </div>
                <div className="flex-grow p-4 overflow-y-auto scrollbar-hide">
                    {isLoading && <p className="text-center text-gray-400">Carregando...</p>}
                    {allCategories && Object.entries(allCategories).map(([type, categories]) => (
                        <div key={type} className="mb-6">
                            <h3 className="text-lg font-bold text-sharkBlue border-b border-sharkBlue/30 mb-2 pb-1">{type}</h3>
                            <div className="space-y-2">
                                {categories.length > 0 ? categories.map(category => (
                                    <label key={category.category_id} className="flex items-center gap-3 p-2 hover:bg-sharkBg rounded-md cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="h-5 w-5 rounded bg-sharkBg border-gray-600 text-sharkBlue focus:ring-sharkBlue"
                                            checked={localBlocked.includes(category.category_id)}
                                            onChange={() => handleToggle(category.category_id)}
                                        />
                                        <span className="text-white">{category.category_name}</span>
                                    </label>
                                )) : <p className="text-gray-500 text-sm pl-2">Nenhuma categoria encontrada.</p>}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t border-gray-700 mt-auto flex justify-end gap-4">
                    <button onClick={onClose} className="bg-sharkBg text-white font-semibold px-5 py-2 rounded-md hover:bg-opacity-80">
                        Cancelar
                    </button>
                    <button onClick={handleSaveChanges} className="bg-sharkBlue text-black font-bold px-5 py-2 rounded-md hover:bg-opacity-80">
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlockCategoriesModal;