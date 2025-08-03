import React, { useRef, useEffect } from 'react';
import { useFilters } from './contexts/FilterContext'; // Importa o hook do novo contexto

const Header = ({
  onToggleSidebar,
  activeMenu,
  onMenuChange,
  categories,
  searchTerm,
  onSearchChange,
  isSearchVisible,
  onToggleSearch,
  onLogout,
}) => {
  const searchInputRef = useRef(null);
  // Usa o estado e as funções do FilterContext
  const { selectedCategory, setSelectedCategory, isFilterPanelVisible, toggleFilterPanel } = useFilters();

  useEffect(() => {
    if (isSearchVisible) {
      searchInputRef.current?.focus();
    }
  }, [isSearchVisible]);

  return (
    <header className="fixed top-0 left-0 w-full z-30 bg-sharkBg/80 backdrop-blur-sm shadow-lg">
      <div className="container mx-auto flex flex-col">
        {/* Linha Superior: Logo, Menus Principais, Controles */}
        <div className="flex justify-between items-center px-4 sm:px-8 py-3 h-24">
          <div className="flex items-center gap-4">
            <button onClick={onToggleSidebar} className="text-white text-3xl p-2 hover:text-sharkBlue" title="Opções">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <img src="/logo.png" alt="SharkTV Logo" className="h-20 sm:h-24 w-auto" />
          </div>
          
          <nav className="hidden md:flex flex-grow justify-center items-center gap-6 text-lg">
            {['Canais', 'Filmes', 'Séries', 'Minha Lista'].map(item => (
              <div key={item} className="flex items-center gap-2">
                <button onClick={() => onMenuChange(item)} className={`font-semibold transition-colors duration-200 hover:text-white ${activeMenu === item ? 'text-white' : 'text-gray-400'}`}>
                  {item}
                </button>
                {/* Ícone de funil aparece ao lado do menu ativo */}
                {activeMenu === item && activeMenu !== 'Minha Lista' && (
                  <button onClick={toggleFilterPanel} title="Alternar Filtros">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 transition-colors ${isFilterPanelVisible ? 'text-sharkBlue' : 'text-gray-500 hover:text-white'}`}>
                      <path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.033a.75.75 0 01-1.5 0v-3.033a2.25 2.25 0 00-.659-1.59L2 6.22a2.25 2.25 0 01-.659-1.59V2.34a.75.75 0 01.628-.74z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </nav>
          
          <div className="flex items-center gap-4">
            <div className="relative flex items-center">
              <input ref={searchInputRef} type="text" value={searchTerm} onChange={onSearchChange} placeholder="Buscar..." className={`bg-sharkSurface rounded-full py-2 pl-4 pr-10 text-white outline-none transition-all duration-300 focus:ring-2 focus:ring-sharkBlue ${isSearchVisible ? 'w-64' : 'w-0 p-0 border-none'}`} />
              <button onClick={onToggleSearch} className={`p-2 text-gray-400 hover:text-white ${isSearchVisible ? 'absolute right-0 mr-1' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
              </button>
            </div>
            <button onClick={onLogout} className="bg-sharkRed px-4 py-2 rounded font-bold whitespace-nowrap">Sair</button>
          </div>
        </div>
        
        {/* Linha Inferior: Filtros de Categoria */}
        {isFilterPanelVisible && activeMenu !== 'Minha Lista' && categories.length > 1 && (
          <div className="container mx-auto px-8 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide border-t border-white/10">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1 text-sm font-semibold rounded-full whitespace-nowrap transition-colors ${selectedCategory === category ? 'bg-white text-black' : 'bg-sharkSurface text-white hover:bg-sharkBlue/50'}`}
              >
                {category === 'all' ? 'Todos' : category}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;