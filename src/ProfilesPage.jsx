import React, { useState } from 'react';
import { useProfiles } from './contexts/ProfilesContext';
import { useNavigate } from 'react-router-dom';

const ProfileForm = ({ profile, onSave, onCancel }) => {
    const [username, setUsername] = useState(profile?.username || '');
    const [m3uUrl, setM3uUrl] = useState(profile?.m3uUrl || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!username.trim() || !m3uUrl.trim()) {
            alert('Todos os campos são obrigatórios.');
            return;
        }
        onSave({ username, m3uUrl });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-sharkSurface p-6 rounded-lg flex flex-col gap-4">
            <h3 className="text-xl font-bold mb-2">{profile ? 'Editar Perfil' : 'Adicionar Novo Perfil'}</h3>
            <input
                type="text"
                placeholder="Nome do Perfil"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="p-3 bg-sharkBg rounded outline-none focus:ring-2 ring-sharkBlue"
                required
            />
            <input
                type="text"
                placeholder="URL da Lista M3U Completa"
                value={m3uUrl}
                onChange={(e) => setM3uUrl(e.target.value)}
                className="p-3 bg-sharkBg rounded outline-none focus:ring-2 ring-sharkBlue"
                required
            />
            <div className="flex justify-end gap-4 mt-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-600 rounded">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-sharkBlue text-black font-bold rounded">Salvar</button>
            </div>
        </form>
    );
};


const ProfilesPage = () => {
    const { profiles, addProfile, updateProfile, deleteProfile } = useProfiles();
    const [editingProfile, setEditingProfile] = useState(null); // Guarda o perfil sendo editado ou 'new' para um novo
    const navigate = useNavigate();

    const handleSave = (profileData) => {
        if (editingProfile === 'new') {
            addProfile(profileData);
        } else {
            updateProfile(editingProfile.id, profileData);
        }
        setEditingProfile(null);
    };

    const handleDelete = (profileId) => {
        if (window.confirm('Tem certeza que deseja excluir este perfil?')) {
            deleteProfile(profileId);
        }
    };

    return (
        <div className="p-4 sm:p-6 md:p-10 max-w-4xl mx-auto text-white min-h-screen bg-sharkBg">
            <header className="flex items-center mb-8">
                <button onClick={() => navigate(-1)} className="bg-sharkSurface p-3 rounded-full hover:bg-sharkBlue/50 transition-colors" title="Voltar">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <h1 className="text-3xl font-bold ml-6">Gerenciar Perfis</h1>
            </header>

            <main>
                {editingProfile && (
                    <div className="mb-8">
                        <ProfileForm
                            profile={editingProfile === 'new' ? null : editingProfile}
                            onSave={handleSave}
                            onCancel={() => setEditingProfile(null)}
                        />
                    </div>
                )}
                
                <div className="bg-sharkSurface p-6 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Perfis Salvos</h2>
                        <button onClick={() => setEditingProfile('new')} className="px-4 py-2 bg-green-600 rounded font-bold">
                            Adicionar Novo
                        </button>
                    </div>
                    <div className="space-y-3">
                        {profiles.length > 0 ? (
                            profiles.map(profile => (
                                <div key={profile.id} className="bg-sharkBg p-4 rounded-md flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-lg">{profile.username}</p>
                                        <p className="text-sm text-gray-400 truncate max-w-xs">{profile.m3uUrl}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => setEditingProfile(profile)} className="px-3 py-1 bg-blue-500 rounded text-sm font-bold">Editar</button>
                                        <button onClick={() => handleDelete(profile.id)} className="px-3 py-1 bg-sharkRed rounded text-sm font-bold">Excluir</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">Nenhum perfil salvo. Adicione um para começar.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilesPage;