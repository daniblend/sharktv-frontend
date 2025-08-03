// --- ARQUIVO CORRIGIDO: src/StandalonePlayer.jsx ---

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Hls from 'hls.js';

const StandalonePlayer = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const hlsRef = useRef(null);
    const setupRef = useRef(false); // Previne execução dupla no dev mode

    const originalStreamUrl = searchParams.get('url');
    const type = searchParams.get('type') || 'live'; // Default para live se não especificado
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Previne execução dupla no React dev mode
        if (setupRef.current) return;
        setupRef.current = true;

        const setupPlayer = async () => {
            const videoElement = videoRef.current;
            if (!originalStreamUrl || !videoElement) {
                setError("URL do stream não fornecida.");
                setIsLoading(false);
                return;
            }

            try {
                // Para todos os tipos, use o proxy
                const finalPlayUrl = await window.electronAPI.startProxy(originalStreamUrl, type);
                console.log(`🎬 Configurando player - Tipo: ${type}, URL: ${finalPlayUrl}`);

                // Limpa a instância HLS anterior
                if (hlsRef.current) {
                    hlsRef.current.destroy();
                    hlsRef.current = null;
                }

                // Detecta se é HLS baseado na URL ou extensão
                const isHlsStream = originalStreamUrl.includes('.m3u8') || 
                                  originalStreamUrl.includes('playlist') ||
                                  type === 'live';

                if (isHlsStream && Hls.isSupported()) {
                    console.log('🔴 Configurando HLS stream...');
                    const hls = new Hls({
                        enableWorker: false,
                        lowLatencyMode: true,
                        backBufferLength: 90
                    });
                    
                    hlsRef.current = hls;
                    
                    hls.on(Hls.Events.MANIFEST_PARSED, () => {
                        console.log('✅ Manifest HLS carregado');
                        setIsLoading(false);
                        videoElement.play().catch(e => {
                            console.warn("Autoplay bloqueado (normal):", e.message);
                        });
                    });

                    hls.on(Hls.Events.ERROR, (_, data) => {
                        console.error('❌ Erro HLS:', data);
                        if (data.fatal) {
                            setError(`Erro no stream: ${data.details}`);
                            setIsLoading(false);
                        }
                    });

                    hls.loadSource(finalPlayUrl);
                    hls.attachMedia(videoElement);
                    
                } else {
                    console.log('🎥 Configurando stream direto...');
                    videoElement.src = finalPlayUrl;
                    
                    videoElement.addEventListener('loadeddata', () => {
                        console.log('✅ Vídeo carregado');
                        setIsLoading(false);
                    });

                    videoElement.addEventListener('error', (e) => {
                        console.error('❌ Erro no vídeo:', e);
                        setError('Erro ao carregar o vídeo');
                        setIsLoading(false);
                    });

                    // Tenta reproduzir
                    videoElement.play().catch(e => {
                        console.warn("Autoplay bloqueado (normal):", e.message);
                        setIsLoading(false);
                    });
                }

            } catch (err) {
                console.error("❌ Erro ao configurar player:", err);
                setError("Falha ao iniciar o serviço de proxy interno.");
                setIsLoading(false);
            }
        };

        setupPlayer();

        // Cleanup
        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
            if (window.electronAPI?.stopProxy) {
                window.electronAPI.stopProxy();
            }
            setupRef.current = false;
        };
    }, [originalStreamUrl, type]);

    const handleGoBack = () => {
        // Para o proxy antes de navegar
        if (window.electronAPI?.stopProxy) {
            window.electronAPI.stopProxy();
        }
        navigate(-1);
    };

    if (error) {
        return (
            <div className="bg-black h-screen w-screen flex flex-col justify-center items-center text-white p-8">
                <h2 className="text-xl font-bold text-red-500">Ocorreu um erro</h2>
                <p className="text-center text-gray-400 mt-4">{error}</p>
                <p className="text-center text-gray-500 text-sm mt-2">
                    Tipo: {type} | URL: {originalStreamUrl?.substring(0, 50)}...
                </p>
                <button 
                    onClick={handleGoBack} 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded mt-6 transition-colors"
                >
                    Voltar
                </button>
            </div>
        );
    }

    return (
        <div className="bg-black h-screen w-screen relative">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-40">
                    <div className="text-white text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                        <p className="text-lg">Carregando stream...</p>
                        <p className="text-sm text-gray-400 mt-2">Tipo: {type}</p>
                    </div>
                </div>
            )}
            
            <video 
                ref={videoRef} 
                controls 
                className="w-full h-full"
                poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMwMDAwMDAiLz48L3N2Zz4="
            />
            
            <button
                onClick={handleGoBack}
                className="absolute top-5 left-5 z-50 bg-black bg-opacity-50 hover:bg-opacity-80 text-white rounded-full p-3 transition-all duration-200"
                title="Voltar"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </button>
        </div>
    );
};

export default StandalonePlayer;