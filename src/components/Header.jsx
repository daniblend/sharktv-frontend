// --- ARQUIVO COMPLETO E FINAL: src/components/Header.jsx ---

import React, { useRef, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUIStore } from '../stores/uiStore';

const Header = () => {
    const { logout } = useAuth();
    const searchInputRef = useRef(null);
    const location = useLocation();
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const {
        toggleSidebar,
        toggleEpg,
        isFilterVisible,
        toggleFilter,
        searchTerm,
        setSearchTerm,
        setDebouncedSearch
    } = useUIStore();

    const menuItems = [
        { name: 'Canais', path: '/app/channels' },
        { name: 'Filmes', path: '/app/movies' },
        { name: 'Séries', path: '/app/series' },
        { name: 'Minha Lista', path: '/app/favorites' },
    ];
    
    const showFilterButton = ['/app/channels', '/app/movies', '/app/series'].includes(location.pathname);

    useEffect(() => {
        if (isSearchVisible) searchInputRef.current?.focus();
    }, [isSearchVisible]);
    
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm, setDebouncedSearch]);

    const toggleSearch = () => {
        if (isSearchVisible && searchTerm) {
            setSearchTerm('');
            searchInputRef.current?.focus();
        } else {
            setIsSearchVisible(!isSearchVisible);
        }
    };

    return (
        <header className="fixed top-0 left-0 w-full z-30 bg-gradient-to-b from-black via-black/90 to-transparent pointer-events-none">
            <div className="flex justify-between items-center py-3 pointer-events-auto h-24 px-2 sm:px-6">
                <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="SharkTV Logo" className="h-20 sm:h-24 w-auto" />
                    <button onClick={toggleSidebar} className="text-white text-3xl p-2 hover:text-sharkBlue" title="Opções">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                    </button>
                </div>
                <nav className="hidden md:flex flex-grow justify-center items-center gap-x-4 text-xl">
                    <button onClick={toggleEpg} className="flex items-center gap-2 font-semibold transition-colors duration-200 text-gray-400 hover:text-white" title="Guia de Programação">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                    {menuItems.map(item => (
                        <div key={item.name} className="relative flex items-center gap-x-2">
                            <NavLink to={item.path} className={({ isActive }) => `font-semibold transition-colors duration-200 hover:text-white ${isActive ? 'text-white' : 'text-gray-400'}`}>
                                {item.name}
                            </NavLink>
                            {showFilterButton && location.pathname === item.path && (
                                <button onClick={toggleFilter} title="Filtrar Categorias" className={`p-1 rounded-full ${isFilterVisible ? 'text-sharkBlue' : 'text-gray-400 hover:text-white'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L16 11.414V16a1 1 0 01-.293.707l-2 2A1 1 0 0113 18v-6.586l-3.707-3.707A1 1 0 019 7V4z" /></svg>
                                </button>
                            )}
                        </div>
                    ))}
                    <div className="relative flex items-center">
                        <input ref={searchInputRef} type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar..." className={`bg-sharkSurface rounded-full py-2 pl-4 pr-10 text-white outline-none transition-all duration-300 focus:ring-2 focus:ring-sharkBlue ${isSearchVisible ? 'w-64' : 'w-0 p-0 border-none'}`} />
                        <button onClick={toggleSearch} className={`p-2 text-gray-400 hover:text-white ${isSearchVisible ? 'absolute right-0 mr-1' : ''}`} title={isSearchVisible && searchTerm ? "Limpar" : "Buscar"}>
                            {isSearchVisible && searchTerm ? <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
                        </button>
                    </div>
                </nav>
                <div className="flex items-center gap-4">
                    <button onClick={logout} className="bg-sharkRed px-4 py-2 rounded font-bold whitespace-nowrap hover:bg-opacity-80 transition-colors">Sair</button>
                </div>
            </div>
        </header>
    );
};

export default Header;