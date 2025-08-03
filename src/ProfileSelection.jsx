import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from './services/api';
import { useAuth } from './contexts/AuthContext';
import toast from 'react-hot-toast';
import LoadingScreen from './components/LoadingScreen';

// --- Funções de API ---
const fetchProfiles = async () => {
    const { data } = await api.get('/api/users/profiles');
    return Array.isArray(data) ? data : [];
};

const registerUser = async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
};


// --- Componente do Formulário de Cadastro (Completo) ---
const RegistrationForm = ({ onCancel }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ['profiles'] });
            onCancel(); // Fecha o formulário e volta para a seleção de perfis
        },
        onError: (error) => toast.error(error.response?.data?.message || 'Falha ao cadastrar usuário.')
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate({ username, password });
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-sharkBg text-white">
            <img src="/logo.png" alt="SharkTV Logo" className="w-72 mb-10" />
            <form onSubmit={handleSubmit} className="bg-sharkSurface p-10 rounded-lg shadow-xl flex flex-col gap-5 w-full max-w-sm">
                <h2 className="text-center text-xl font-semibold text-gray-300 mb-4">Criar Novo Perfil</h2>
                <input type="text" placeholder="Nome de usuário" value={username} onChange={(e) => setUsername(e.target.value)} required className="p-4 bg-sharkBg rounded border-transparent focus:border-sharkBlue outline-none" />
                <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required className="p-4 bg-sharkBg rounded border-transparent focus:border-sharkBlue outline-none" />
                <div className="flex gap-4 mt-2">
                    <button type="button" onClick={onCancel} className="w-full p-3 bg-gray-600 font-bold rounded hover:bg-gray-500 transition-colors">Cancelar</button>
                    <button type="submit" disabled={mutation.isPending} className="w-full p-3 bg-sharkBlue text-sharkBg font-bold rounded hover:bg-opacity-80 transition-colors disabled:opacity-50">
                        {mutation.isPending ? 'Criando...' : 'Criar'}
                    </button>
                </div>
            </form>
        </div>
    );
};


// --- Componente do Card "Adicionar Perfil" (Completo) ---
const AddProfileCard = ({ onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled} className="group flex flex-col items-center justify-center gap-4 text-gray-400 hover:text-white transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-sharkBlue rounded-lg p-2 disabled:opacity-50 disabled:cursor-wait disabled:transform-none">
        <div className="w-40 h-40 rounded-lg bg-sharkSurface border-4 border-transparent group-hover:border-white transition-all duration-300 flex justify-center items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
        </div>
        <span className="text-xl font-semibold tracking-wider">Adicionar Perfil</span>
    </button>
);


// --- Componente Principal (Completo e Final) ---
const ProfileSelection = () => {
    const [view, setView] = useState('profiles');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const { data: profiles, isLoading, isError } = useQuery({ queryKey: ['profiles'], queryFn: fetchProfiles });
    const { loginAsProfile, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Lógica Reativa: navega QUANDO o estado de autenticação muda para true.
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/app');
        }
    }, [isAuthenticated, navigate]);

    const handleProfileSelect = (profile) => {
        if (isLoggingIn) return; // Previne cliques duplos
        setIsLoggingIn(true); // Bloqueia a UI

        const loginPromise = loginAsProfile(profile);

        toast.promise(loginPromise, {
            loading: `Entrando como ${profile.username}...`,
            success: `Login bem-sucedido! Redirecionando...`,
            error: (err) => err.message || 'Não foi possível fazer login com este perfil.',
        });
        
        // Garante que o bloqueio da UI seja removido quando a promessa terminar
        loginPromise.finally(() => {
            setIsLoggingIn(false);
        });
    };
    
    if (isLoading) return <LoadingScreen message="Verificando perfis..." />;
    if (isError) return <div className="text-center text-sharkRed mt-20">Erro ao carregar perfis.</div>;
    
    if (view === 'register') {
        return <RegistrationForm onCancel={() => setView('profiles')} />;
    }

    const avatarImages = ['/users/shark-king.png', '/users/shark-cool.png', '/users/shark-happy.png', '/users/shark-baby.png'];

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-sharkBg text-white">
            <img src="/logo.png" alt="SharkTV Logo" className="w-72 mb-16" />
            <h1 className="text-4xl font-light mb-12 tracking-widest">Quem está assistindo?</h1>
            <div className="flex flex-wrap justify-center items-start gap-8">
                {profiles?.map((profile, index) => (
                    <button 
                        key={profile.id} 
                        onClick={() => handleProfileSelect(profile)} 
                        disabled={isLoggingIn}
                        className="group flex flex-col items-center gap-4 text-gray-400 hover:text-white transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-sharkBlue rounded-lg p-2 disabled:opacity-50 disabled:cursor-wait disabled:transform-none"
                    >
                        <div className="w-40 h-40 rounded-lg overflow-hidden border-4 border-transparent group-hover:border-white transition-all duration-300">
                           <img src={avatarImages[index % avatarImages.length]} alt={profile.username} className="w-full h-full object-cover"/>
                        </div>
                        <span className="text-xl font-semibold tracking-wider">{profile.username}</span>
                    </button>
                ))}
                <AddProfileCard onClick={() => setView('register')} disabled={isLoggingIn} />
            </div>
        </div>
    );
};

export default ProfileSelection;