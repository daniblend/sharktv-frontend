import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { useProfiles } from './ProfilesContext'; // Importa nosso novo hook de perfis

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [activeProfileId, setActiveProfileId] = useState(() => localStorage.getItem('sharktv_active_profile_id'));
    const [loading, setLoading] = useState(true);
    const { getProfileById } = useProfiles(); // Pega a função para buscar perfis

    // O 'usuário' ativo agora é derivado do ID do perfil ativo
    const user = useMemo(() => {
        if (!activeProfileId) return null;
        return getProfileById(activeProfileId);
    }, [activeProfileId, getProfileById]);

    // Apenas para remover o estado de 'loading' inicial
    useEffect(() => {
        setLoading(false);
    }, []);

    // Login agora significa definir o perfil ativo
    const login = (profileId) => {
        localStorage.setItem('sharktv_active_profile_id', profileId);
        setActiveProfileId(profileId);
    };

    // Logout limpa o perfil ativo
    const logout = () => {
        setActiveProfileId(null);
        localStorage.removeItem('sharktv_active_profile_id');
    };

    const authValue = useMemo(() => ({
        user,
        login,
        logout,
        isAuthenticated: !!user, // Autenticado se houver um usuário ativo
        loading,
    }), [user, loading, logout]);

    return (
        <AuthContext.Provider value={authValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};