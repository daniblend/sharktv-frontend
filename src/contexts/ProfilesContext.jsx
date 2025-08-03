// --- ARQUIVO A SER ATUALIZADO: src/contexts/ProfilesContext.jsx ---

import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Esta sintaxe é a correta para a versão nova

const ProfilesContext = createContext(null);

export const ProfilesProvider = ({ children }) => {
    const [profiles, setProfiles] = useState(() => {
        try {
            const storedProfiles = localStorage.getItem('sharktv_profiles');
            return storedProfiles ? JSON.parse(storedProfiles) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('sharktv_profiles', JSON.stringify(profiles));
    }, [profiles]);

    const addProfile = (profileData) => {
        const newProfile = { id: uuidv4(), ...profileData };
        setProfiles(prev => [...prev, newProfile]);
        return newProfile;
    };

    const updateProfile = (profileId, updatedData) => {
        setProfiles(prev => prev.map(p => (p.id === profileId ? { ...p, ...updatedData } : p)));
    };

    const deleteProfile = (profileId) => {
        setProfiles(prev => prev.filter(p => p.id !== profileId));
    };

    const getProfileById = (profileId) => {
        return profiles.find(p => p.id === profileId);
    };

    const value = useMemo(() => ({
        profiles,
        addProfile,
        updateProfile,
        deleteProfile,
        getProfileById
    }), [profiles]);

    return (
        <ProfilesContext.Provider value={value}>
            {children}
        </ProfilesContext.Provider>
    );
};

export const useProfiles = () => {
    const context = useContext(ProfilesContext);
    if (!context) {
        throw new Error('useProfiles deve ser usado dentro de um ProfilesProvider');
    }
    return context;
};