import React from 'react';
import { useAuth } from './contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const handleLogout = () => {
        onClose();
        logout();
        // Redireciona para a página de login após o logout
        navigate('/login'); 
    };

    const handleClearCache = () => {
        queryClient.clear();
        onClose();
        toast.success('Cache limpo! A aplicação será recarregada.');
        setTimeout(() => window.location.reload(), 1500);
    };
    
    return (
        <>
            <div 
                className={`fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>
            
            <aside 
                className={`fixed top-0 left-0 h-full w-72 bg-sharkSurface shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="p-6 flex flex-col h-full text-white">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold">SharkTV</h2>
                        <p className="text-sm text-gray-400">Opções</p>
                    </div>

                    <div className="border-t border-b border-gray-700 py-4 mb-4">
                        <h3 className="font-bold text-lg mb-2">Perfil Ativo</h3>
                        <p className="truncate">Usuário: <span className="font-bold text-sharkBlue">{user?.username}</span></p>
                    </div>

                    <nav className="flex flex-col gap-2 flex-grow overflow-y-auto scrollbar-hide">
                        <Link 
                            to="/profiles" 
                            onClick={onClose} 
                            className="w-full text-left p-3 rounded-md hover:bg-sharkBg font-bold"
                        >
                            Gerenciar Perfis
                        </Link>
                        
                        <button 
                            onClick={handleClearCache} 
                            className="w-full text-left p-3 rounded-md hover:bg-sharkBg font-bold"
                        >
                            Limpar Cache de Listas
                        </button>
                    </nav>

                    <div className="mt-4 border-t border-gray-700 pt-4">
                        <button onClick={handleLogout} className="w-full text-left p-3 bg-sharkRed rounded-md hover:bg-opacity-80 font-bold transition-colors">
                            Trocar Perfil / Sair
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;