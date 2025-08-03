// --- ARQUIVO A SER ATUALIZADO: src/SeriesDetails.jsx ---

import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './contexts/AuthContext';
// A linha 'import { URL } from 'url';' FOI REMOVIDA

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

const fetchSeriesInfo = async ({ queryKey }) => {
    const [_key, seriesId, providerInfo] = queryKey;
    if (!seriesId || !providerInfo) return null;

    const { baseUrl, username, password } = providerInfo;
    const apiUrl = `${baseUrl}/player_api.php?username=${username}&password=${password}&action=get_series_info&series_id=${seriesId}`;
    
    const response = await fetch(apiUrl, { headers: { 'User-Agent': 'IPTV Smarters/1.0' } });
    if (!response.ok) {
        throw new Error("Não foi possível buscar informações da série.");
    }
    return response.json();
};

const SeriesDetails = ({ item, onClose, onPlayEpisode }) => {
    const { user } = useAuth();
    const providerInfo = useMemo(() => getProviderInfo(user?.m3uUrl), [user?.m3uUrl]);

    const { data: seriesData, isLoading, isError } = useQuery({
        queryKey: ['seriesInfo', item.stream_id, providerInfo],
        queryFn: fetchSeriesInfo,
        enabled: !!item.stream_id && !!providerInfo,
    });
    
    const { info, episodes: episodesBySeason } = seriesData || {};
    const seasons = useMemo(() => episodesBySeason ? Object.keys(episodesBySeason).sort((a, b) => Number(a) - Number(b)) : [], [episodesBySeason]);
    const [selectedSeason, setSelectedSeason] = useState('');
    
    useEffect(() => {
        if (seasons.length > 0) {
            setSelectedSeason(seasons[0]);
        }
    }, [seasons]);
    
    const episodes = useMemo(() => (episodesBySeason && selectedSeason) ? episodesBySeason[selectedSeason] : [], [episodesBySeason, selectedSeason]);
    const backdropStyle = info?.backdrop_path?.[0] ? { backgroundImage: `url(${info.backdrop_path[0]})` } : {};

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="relative w-full h-full max-w-5xl max-h-[90vh] bg-sharkBg rounded-lg shadow-xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="absolute inset-0 bg-cover bg-center opacity-20" style={backdropStyle} />
                <div className="absolute inset-0 bg-black bg-opacity-70 md:bg-opacity-60 md:bg-gradient-to-r from-sharkBg via-sharkBg/80 to-transparent" />
                <button onClick={onClose} className="absolute top-4 right-4 text-white text-3xl hover:text-sharkBlue transition-colors z-20">×</button>
                <div className="relative z-10 p-6 md:p-8 text-white flex-shrink-0">
                    <h1 className="text-3xl md:text-5xl font-bold mb-2">{info?.name || item.title}</h1>
                    <p className="text-gray-300 text-sm md:text-base max-h-24 overflow-y-auto">{info?.plot || 'Sinopse não disponível.'}</p>
                </div>
                <div className="relative z-10 px-6 md:px-8 py-4 flex flex-col flex-grow overflow-hidden">
                    <div className="flex items-center gap-4 border-b border-white/10 pb-2 mb-2 flex-shrink-0">
                        <h2 className="text-xl font-bold">Episódios</h2>
                        <select value={selectedSeason} onChange={(e) => setSelectedSeason(e.target.value)} className="bg-sharkSurface text-white rounded px-2 py-1 border border-transparent focus:ring-2 focus:ring-sharkBlue outline-none" disabled={isLoading || seasons.length === 0}>
                            {isLoading && <option>Carregando...</option>}
                            {seasons.map(seasonNum => <option key={seasonNum} value={seasonNum}>Temporada {seasonNum}</option>)}
                        </select>
                    </div>
                    <div className="flex-grow overflow-y-auto scrollbar-hide">
                        {isLoading && <p className="p-3 text-gray-400">Carregando episódios...</p>}
                        {isError && <p className="p-3 text-sharkRed">Erro ao carregar episódios.</p>}
                        {!isLoading && episodes.length === 0 && <p className="p-3 text-gray-400">Nenhum episódio encontrado.</p>}
                        {episodes?.map(ep => (
                            <button
                                key={ep.id}
                                onClick={() => onPlayEpisode({
                                    url: `${providerInfo.baseUrl}/series/${providerInfo.username}/${providerInfo.password}/${ep.id}.${ep.container_extension}`,
                                    title: `${info?.name || item.title} - S${ep.season}E${ep.episode_num} ${ep.title || ''}`,
                                })}
                                className="w-full text-left p-3 hover:bg-white/10 rounded-md flex items-center gap-4 transition-colors"
                            >
                                <span className="font-bold text-sharkBlue w-8">{ep.episode_num}</span>
                                <span className="truncate flex-grow">{ep.title || `Episódio ${ep.episode_num}`}</span>
                                <span className="text-xl text-white/50">▶</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeriesDetails;