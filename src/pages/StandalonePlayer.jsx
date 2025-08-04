// src/pages/StandalonePlayer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Hls from 'hls.js';

const StandalonePlayer = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const hlsRef = useRef(null);
    const setupRef = useRef(false);

    const originalStreamUrl = searchParams.get('url');
    const type = searchParams.get('type') || 'live';
    const title = searchParams.get('title') || 'Reproduzindo...';
    
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);

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
                console.log(`🎬 Configurando player - Tipo: ${type}, URL: ${originalStreamUrl}`);

                // Para todos os tipos, use o proxy
                let finalPlayUrl;
                if (window.electronAPI?.startProxy) {
                    finalPlayUrl = await window.electronAPI.startProxy(originalStreamUrl, type);
                    console.log(`🔗 Proxy URL: ${finalPlayUrl}`);
                } else {
                    // Fallback para desenvolvimento sem Electron
                    finalPlayUrl = originalStreamUrl;
                    console.warn('⚠️ Electron não disponível, usando URL direta');
                }

                // Limpa a instância HLS anterior
                if (hlsRef.current) {
                    hlsRef.current.destroy();
                    hlsRef.current = null;
                }

                // Detecta se é HLS baseado na URL ou tipo
                const isHlsStream = originalStreamUrl.includes('.m3u8') || 
                                  originalStreamUrl.includes('playlist') ||
                                  type === 'live';

                if (isHlsStream && Hls.isSupported()) {
                    console.log('🔴 Configurando HLS stream...');
                    
                    const hls = new Hls({
                        enableWorker: false,
                        lowLatencyMode: true,
                        backBufferLength: 90,
                        maxBufferLength: 30,
                        maxMaxBufferLength: 600,
                        maxBufferSize: 60 * 1000 * 1000,
                        maxBufferHole: 0.5,
                        debug: false
                    });
                    
                    hlsRef.current = hls;
                    
                    hls.on(Hls.Events.MANIFEST_PARSED, () => {
                        console.log('✅ Manifest HLS carregado');
                        setIsLoading(false);
                        videoElement.play().then(() => {
                            setIsPlaying(true);
                        }).catch(e => {
                            console.warn("Autoplay bloqueado:", e.message);
                            setIsLoading(false);
                        });
                    });

                    hls.on(Hls.Events.ERROR, (_, data) => {
                        console.error('❌ Erro HLS:', data);
                        if (data.fatal) {
                            switch (data.type) {
                                case Hls.ErrorTypes.NETWORK_ERROR:
                                    setError('Erro de rede. Verifique sua conexão.');
                                    break;
                                case Hls.ErrorTypes.MEDIA_ERROR:
                                    setError('Erro de mídia. Formato não suportado.');
                                    break;
                                default:
                                    setError(`Erro no stream: ${data.details}`);
                                    break;
                            }
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
                        setError('Erro ao carregar o vídeo. Verifique a URL.');
                        setIsLoading(false);
                    });

                    videoElement.addEventListener('play', () => {
                        setIsPlaying(true);
                    });

                    videoElement.addEventListener('pause', () => {
                        setIsPlaying(false);
                    });

                    // Tenta reproduzir
                    videoElement.play().then(() => {
                        setIsPlaying(true);
                    }).catch(e => {
                        console.warn("Autoplay bloqueado:", e.message);
                        setIsLoading(false);
                    });
                }

            } catch (err) {
                console.error("❌ Erro ao configurar player:", err);
                setError("Falha ao iniciar o player. Verifique sua conexão.");
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

    const togglePlayPause = () => {
        const video = videoRef.current;
        if (video) {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        }
    };

    if (error) {
        return (
            <div className="bg-black h-screen w-screen flex flex-col justify-center items-center text-white p-8">
                <div className="max-w-md text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-red-500 mb-4">Erro na Reprodução</h2>
                    <p className="text-gray-300 mb-4">{error}</p>
                    <div className="text-sm text-gray-500 mb-6">
                        <p><strong>Tipo:</strong> {type}</p>
                        <p><strong>URL:</strong> {originalStreamUrl?.substring(0, 50)}...</p>
                    </div>
                    <button 
                        onClick={handleGoBack} 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        ← Voltar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black h-screen w-screen relative overflow-hidden">
            {/* Loading Overlay */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-40">
                    <div className="text-white text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-lg mb-2">Carregando stream...</p>
                        <p className="text-sm text-gray-400">{title}</p>
                        <p className="text-xs text-gray-500 mt-2">Tipo: {type}</p>
                    </div>
                </div>
            )}
            
            {/* Video Player */}
            <video 
                ref={videoRef} 
                controls 
                className="w-full h-full object-contain"
                poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMwMDAwMDAiLz48L3N2Zz4="
                onLoadStart={() => console.log('🔄 Iniciando carregamento do vídeo')}
                onCanPlay={() => console.log('✅ Vídeo pronto para reproduzir')}
                onWaiting={() => console.log('⏳ Aguardando buffer')}
                onError={(e) => console.error('❌ Erro no elemento de vídeo:', e)}
            />
            
            {/* Controls Overlay */}
            <div className="absolute top-5 left-5 z-50 flex gap-3">
                <button
                    onClick={handleGoBack}
                    className="bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-full p-3 transition-all duration-200 backdrop-blur-sm"
                    title="Voltar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>

                {!isLoading && (
                    <button
                        onClick={togglePlayPause}
                        className="bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-full p-3 transition-all duration-200 backdrop-blur-sm"
                        title={isPlaying ? "Pausar" : "Reproduzir"}
                    >
                        {isPlaying ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                            </svg>
                        )}
                    </button>
                )}
            </div>

            {/* Title Overlay */}
            {!isLoading && (
                <div className="absolute top-5 right-5 z-50">
                    <div className="bg-black bg-opacity-60 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
                        <p className="text-sm font-medium">{title}</p>
                        <p className="text-xs text-gray-300">Tipo: {type}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StandalonePlayer;