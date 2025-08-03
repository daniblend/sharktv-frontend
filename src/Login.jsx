import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useProfiles } from './contexts/ProfilesContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useAuth();
    const { profiles, addProfile } = useProfiles();
    const navigate = useNavigate();
    const [isAddingNew, setIsAddingNew] = useState(profiles.length === 0);
    const [username, setUsername] = useState('');
    const [m3uUrl, setM3uUrl] = useState('');
    const [error, setError] = useState('');

    const handleSelectProfile = (profileId) => {
        login(profileId);
        navigate('/');
    };

    const handleSubmitNewProfile = (e) => {
        e.preventDefault();
        setError('');
        if (!username.trim() || !m3uUrl.trim()) {
            setError('Todos os campos são obrigatórios.');
            return;
        }
        try {
            const url = new URL(m3uUrl);
            if (!url.searchParams.has('username') || !url.searchParams.has('password')) {
                throw new Error("A URL não contém 'username' e 'password'.");
            }
            const newProfile = addProfile({ username: username.trim(), m3uUrl: m3uUrl.trim(), role: 'user' });
            login(newProfile.id);
            navigate('/');
        } catch (err) {
            setError('A URL da lista M3U parece ser inválida ou não tem o formato esperado.');
        }
    };
    
    return (
        <div className="flex justify-center items-center h-screen bg-sharkBg">
            <div className="bg-sharkSurface p-10 rounded-lg shadow-xl flex flex-col gap-5 w-full max-w-sm text-white">
                <img src="/logo.png" alt="SharkTV Logo" className="w-48 mx-auto mb-8" />

                {isAddingNew ? (
                    <form onSubmit={handleSubmitNewProfile} className="flex flex-col gap-5">
                        <h2 className="text-xl text-center font-bold">Adicionar Primeiro Perfil</h2>
                        <input
                            type="text"
                            placeholder="Nome do Perfil"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="p-4 bg-sharkBg rounded border border-transparent focus:border-sharkBlue outline-none"
                            required
                        />
                        <input
                            type="text"
                            placeholder="URL da Lista M3U Completa"
                            value={m3uUrl}
                            onChange={(e) => setM3uUrl(e.target.value)}
                            className="p-4 bg-sharkBg rounded border border-transparent focus:border-sharkBlue outline-none"
                            required
                        />
                        <button type="submit" className="p-4 bg-sharkBlue text-black font-bold rounded hover:bg-opacity-80">
                            Salvar e Entrar
                        </button>
                        {profiles.length > 0 && (
                            <button type="button" onClick={() => setIsAddingNew(false)} className="text-center text-gray-400 hover:text-white mt-2">
                                Voltar para Seleção
                            </button>
                        )}
                        {error && <p className="text-sharkRed text-center mt-2">{error}</p>}
                    </form>
                ) : (
                    <div className="flex flex-col gap-4">
                        <h2 className="text-xl text-center font-bold">Selecionar Perfil</h2>
                        {profiles.map(profile => (
                            <button 
                                key={profile.id} 
                                onClick={() => handleSelectProfile(profile.id)}
                                className="w-full p-4 bg-sharkBg rounded text-lg font-semibold hover:bg-sharkBlue/30"
                            >
                                {profile.username}
                            </button>
                        ))}
                        <button onClick={() => setIsAddingNew(true)} className="mt-4 p-3 bg-green-600 rounded font-bold">
                            Adicionar Outro Perfil
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;