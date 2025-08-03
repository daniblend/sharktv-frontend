// --- ARQUIVO COMPLETO E FINAL: src/components/EPGGuide.jsx ---

import React, { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { useSpatialNavigation } from '../hooks/useSpatialNavigation';

const fetchEpgData = async () => {
    const { data } = await api.get('/api/full_epg_guide');
    return data;
};

const EPGGuide = ({ isOpen, onClose, onPlayChannel }) => {
    const epgRef = useRef(null);
    useSpatialNavigation(epgRef, { enabled: isOpen, initialFocus: true });

    const { data: channels, isLoading, isError } = useQuery({
        queryKey: ['fullEpgData'],
        queryFn: fetchEpgData,
        staleTime: 1000 * 60 * 15,
        refetchOnWindowFocus: false,
        enabled: isOpen,
    });

    return (
        <div 
            className={`fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col p-2 sm:p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
        >
            <div ref={epgRef} className="flex flex-col w-full h-full max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-4 flex-shrink-0 text-white">
                    <h1 className="text-2xl font-bold">Guia de Programação</h1>
                    <button onClick={onClose} className="text-white text-3xl hover:text-sharkBlue transition-colors z-20">×</button>
                </div>
                
                <div className="flex-grow bg-sharkSurface/50 rounded-lg overflow-y-auto scrollbar-hide" onClick={e => e.stopPropagation()}>
                    {isLoading && <div className="p-8 text-center text-white">Carregando guia...</div>}
                    {isError && <div className="p-8 text-center text-sharkRed">Não foi possível carregar o guia.</div>}
                    
                    {channels && channels.length > 0 ? (
                        <div className="divide-y divide-gray-700/50">
                            {channels.map(channel => (
                                <button key={channel.stream_id} onClick={() => onPlayChannel(channel)} className="w-full grid grid-cols-5 md:grid-cols-6 p-3 hover:bg-sharkBg/70 transition-colors text-left">
                                    <div className="col-span-2 md:col-span-2 flex items-center gap-4 min-w-0">
                                        <img src={channel.logo} alt={channel.title} className="h-10 w-auto object-contain flex-shrink-0" />
                                        <span className="font-bold text-white truncate">{channel.title}</span>
                                    </div>
                                    <div className="col-span-2 md:col-span-3 flex flex-col justify-center min-w-0">
                                        <p className="font-semibold text-white truncate">{channel.epg.title}</p>
                                        <p className="text-sm text-gray-400 truncate hidden sm:block">{channel.epg.description}</p>
                                    </div>
                                    <div className="col-span-1 flex items-center justify-end">
                                        <div className="bg-sharkBlue text-black px-4 py-1.5 rounded-md font-bold text-sm">
                                            Assistir
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        !isLoading && <div className="p-8 text-center text-gray-400">Guia de programação não encontrado ou vazio.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EPGGuide;