import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Função para extrair informações da URL M3U do usuário
const getProviderInfo = (m3uUrl) => {
    if (!m3uUrl) return null;
    try {
        const url = new URL(m3uUrl);
        return {
            baseUrl: url.origin,
            username: url.searchParams.get('username'),
            password: url.searchParams.get('password'),
        };
    } catch (error) {
        console.error("URL M3U inválida:", error);
        return null;
    }
};

// Função para buscar os dados do EPG na API do provedor
const fetchEpgData = async ({ queryKey }) => {
    const [_key, providerInfo] = queryKey;
    if (!providerInfo) return null;

    const { baseUrl, username, password } = providerInfo;
    const apiUrl = `${baseUrl}/player_api.php?username=${username}&password=${password}&action=get_simple_data_table`;
    
    const response = await fetch(apiUrl, { headers: { 'User-Agent': 'IPTV Smarters/1.0' } });
    if (!response.ok) {
        throw new Error('Não foi possível buscar os dados do Guia de Programação.');
    }
    const data = await response.json();
    return data.epg_listings || [];
};

const EpgGuide = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const providerInfo = useMemo(() => getProviderInfo(user?.m3uUrl), [user?.m3uUrl]);

    const { data: epgData, isLoading, isError } = useQuery({
        queryKey: ['epg', providerInfo],
        queryFn: fetchEpgData,
        enabled: !!providerInfo,
        staleTime: 1000 * 60 * 30, // Cache de 30 minutos
        refetchOnWindowFocus: false,
    });

    // Função para formatar a hora a partir de um timestamp
    const formatTime = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="bg-sharkBg min-h-screen text-white p-4 sm:p-8">
            {/* Cabeçalho com botão Voltar */}
            <header className="flex items-center mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="bg-sharkSurface p-3 rounded-full hover:bg-sharkBlue/50 transition-colors"
                    title="Voltar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <h1 className="text-3xl font-bold ml-6">Guia de Programação</h1>
            </header>

            {/* Conteúdo do Guia */}
            <main>
                {isLoading && <p className="text-center text-xl">Carregando guia...</p>}
                {isError && <p className="text-center text-xl text-sharkRed">Não foi possível carregar o guia de programação.</p>}
                
                <div className="space-y-4">
                    {epgData && epgData.map((channelEpg) => (
                        <div key={channelEpg.id} className="bg-sharkSurface p-4 rounded-lg flex items-center gap-4">
                            <div className="w-32 flex-shrink-0 text-center">
                                <p className="font-bold text-lg truncate">{channelEpg.epg_id}</p>
                            </div>
                            <div className="flex-grow">
                                {channelEpg.events && channelEpg.events.length > 0 ? (
                                    channelEpg.events.slice(0, 2).map(event => ( // Mostra apenas os 2 próximos eventos
                                        <div key={event.id} className="mb-2 last:mb-0">
                                            <p className="font-semibold text-sharkBlue">{atob(event.title)}</p>
                                            <p className="text-sm text-gray-400">
                                                {formatTime(event.start_timestamp)} - {formatTime(event.end_timestamp)}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">Programação não disponível.</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default EpgGuide;