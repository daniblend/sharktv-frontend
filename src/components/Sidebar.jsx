// --- ARQUIVO COMPLETO E CORRIGIDO: src/Sidebar.jsx ---

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from './services/api';
import { useAuth } from './contexts/AuthContext';
import { useParentalControl } from './contexts/ParentalControlContext';
import ConfirmModal from './components/ConfirmModal';
import BlockCategoriesModal from './components/BlockCategoriesModal'; // Importa o novo modal

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const { openPinSettings, hasPin, isLocked, requestPin, lock } = useParentalControl();
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false); // Estado para o novo modal

    const handleToggleLock = () => {
        if (isLocked) {
            requestPin(() => onClose());
        } else {
            lock();
            onClose();
        }
    };

    const handleBlockCategoriesClick = () => {
        setIsBlockModalOpen(true);
        onClose();
    };

    return (
        <>
            <div className={`fixed inset-0 bg-black bg-opacity-60 z-40 ...`} onClick={onClose}></div>
            <aside className={`fixed top-0 left-0 h-full w-72 bg-sharkSurface ...`}>
                <div className="p-6 flex flex-col h-full text-white">
                    {/* ... (cabeçalho da sidebar e perfil) ... */}
                    <nav className="flex flex-col gap-2 flex-grow">
                        {user?.role === 'admin' && ( /* ... */ )}
                        
                        {hasPin && (
                            <button onClick={handleToggleLock} className="w-full text-left p-3 ...">
                                {isLocked ? 'Desbloquear Conteúdo' : 'Bloquear Conteúdo'}
                            </button>
                        )}

                        {/* NOVO BOTÃO */}
                        {hasPin && (
                            <button onClick={handleBlockCategoriesClick} className="w-full text-left p-3 ...">
                                Bloquear Categorias
                            </button>
                        )}

                        <button onClick={() => { openPinSettings(); onClose(); }} className="w-full text-left p-3 ...">
                            {hasPin ? 'Gerenciar PIN' : 'Criar PIN'}
                        </button>
                    </nav>
                    {/* ... (rodapé da sidebar) ... */}
                </div>
            </aside>
            
            <ConfirmModal isOpen={isConfirmModalOpen} onConfirm={...} onCancel={...} />
            
            {/* NOVO MODAL SENDO RENDERIZADO */}
            <BlockCategoriesModal 
                isOpen={isBlockModalOpen} 
                onClose={() => setIsBlockModalOpen(false)} 
            />
        </>
    );
};

export default Sidebar;