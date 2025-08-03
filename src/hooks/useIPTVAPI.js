// --- ARQUIVO NOVO: src/hooks/useIPTVAPI.js ---

import { useState, useEffect, useCallback } from 'react';

const API_CONFIG = {
    baseUrl: 'http://xwkhb.info',
    username: 'jack552145',
    password: 'Ja125452ck',
    timeout: 30000
};

export const useIPTVAPI = () => {
    const [data, setData] = useState({
        movies: [],
        series: [],
        channels: [],
        movieCategories: [],
        seriesCategories: [],
        channelCategories: []
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Função para fazer requisições individuais
    const apiRequest = useCallback(async (action, retries = 3) => {
        const url = `${API_CONFIG.baseUrl}/player_api.php?username=${API_CONFIG.username}&password=${API_CONFIG.password}&action=${action}`;
        
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                console.log(`📡 API Request (${attempt}/${retries}): ${action}`);
                
                if (!window.electronAPI?.fetchData) {
                    throw new Error('Electron API não disponível');
                }

                const response = await window.electronAPI.fetchData(url, {
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'SharkTV-Player/1.0',
                        'Cache-Control': 'no-cache'
                    }
                });

                if (response.status >= 200 && response.status < 300) {
                    console.log(`✅ Sucesso: ${action} (${response.status})`);
                    return Array.isArray(response.data) ? response.data : [];
                } else {
                    throw new Error(`HTTP ${response.status}: ${response.statusText || 'Erro na requisição'}`);
                }
                
            } catch (error) {
                console.warn(`⚠️ Tentativa ${attempt}/${retries} falhou para ${action}:`, error.message);
                
                if (attempt === retries) {
                    console.error(`❌ Falha final em ${action}:`, error);
                    throw error;
                }
                
                // Backoff exponencial
                const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }, []);

    // Carrega todos os dados
    const loadAllData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            console.log('🔄 Iniciando carregamento completo dos dados...');

            const requests = [
                { key: 'movies', action: 'get_vod_streams' },
                { key: 'movieCategories', action: 'get_vod_categories' },
                { key: 'channels', action: 'get_live_streams' },
                { key: 'channelCategories', action: 'get_live_categories' },
                { key: 'series', action: 'get_series' },
                { key: 'seriesCategories', action: 'get_series_categories' }
            ];

            // Executa em lotes para não sobrecarregar
            const batchSize = 2;
            const results = {};
            
            for (let i = 0; i < requests.length; i += batchSize) {
                const batch = requests.slice(i, i + batchSize);
                
                const batchResults = await Promise.allSettled(
                    batch.map(async ({ key, action }) => {
                        try {
                            const data = await apiRequest(action);
                            return { key, data, success: true };
                        } catch (error) {
                            console.error(`❌ Falha em ${key}:`, error.message);
                            return { key, data: [], success: false, error: error.message };
                        }
                    })
                );

                batchResults.forEach(result => {
                    if (result.status === 'fulfilled') {
                        const { key, data } = result.value;
                        results[key] = data;
                    }
                });

                // Pausa entre lotes
                if (i + batchSize < requests.length) {
                    await new Promise(resolve => setTimeout(resolve, 800));
                }
            }

            const totalItems = (results.movies?.length || 0) + 
                             (results.series?.length || 0) + 
                             (results.channels?.length || 0);

            console.log('✅ Carregamento concluído:', {
                filmes: results.movies?.length || 0,
                series: results.series?.length || 0,
                canais: results.channels?.length || 0,
                total: totalItems
            });

            if (totalItems === 0) {
                throw new Error('Nenhum conteúdo foi carregado. Verifique as credenciais.');
            }

            setData(results);

        } catch (error) {
            console.error('❌ Erro crítico no carregamento:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [apiRequest]);

    // Busca informações detalhadas de um filme/série
    const getMovieInfo = useCallback(async (vodId) => {
        try {
            return await apiRequest(`get_vod_info&vod_id=${vodId}`);
        } catch (error) {
            console.error('❌ Erro ao buscar info do filme:', error);
            return null;
        }
    }, [apiRequest]);

    // Busca informações de uma série
    const getSeriesInfo = useCallback(async (seriesId) => {
        try {
            return await apiRequest(`get_series_info&series_id=${seriesId}`);
        } catch (error) {
            console.error('❌ Erro ao buscar info da série:', error);
            return null;
        }
    }, [apiRequest]);

    // Gera URL de stream
    const buildStreamUrl = useCallback((content, type) => {
        try {
            switch (type) {
                case 'movie':
                    return `${API_CONFIG.baseUrl}/movie/${API_CONFIG.username}/${API_CONFIG.password}/${content.stream_id}.${content.container_extension || 'mp4'}`;
                
                case 'series':
                    return content.stream_url || content.url;
                
                case 'live':
                    return `${API_CONFIG.baseUrl}/live/${API_CONFIG.username}/${API_CONFIG.password}/${content.stream_id}.${content.stream_type || 'm3u8'}`;
                
                default:
                    throw new Error(`Tipo de stream inválido: ${type}`);
            }
        } catch (error) {
            console.error('❌ Erro ao construir URL:', error);
            return null;
        }
    }, []);

    // Auto-carrega dados na inicialização
    useEffect(() => {
        if (window.electronAPI?.fetchData) {
            loadAllData();
        } else {
            setError('API do Electron não está disponível. Reinicie a aplicação.');
        }
    }, [loadAllData]);

    return {
        data,
        loading,
        error,
        loadAllData,
        getMovieInfo,
        getSeriesInfo,
        buildStreamUrl,
        apiRequest
    };
};