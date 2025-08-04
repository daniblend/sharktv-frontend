// src/hooks/useIPTVCache.js - Sistema de Cache Inteligente
import { useState, useEffect, useCallback } from 'react';
import { getAPIConfig, validateCredentials } from '../config/api';

const CACHE_KEY = 'sharktv_cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos

export const useIPTVCache = () => {
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
    const [lastUpdated, setLastUpdated] = useState(null);
    const [apiConfig] = useState(() => getAPIConfig());

    // Carrega dados do cache
    const loadFromCache = useCallback(() => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const { data: cachedData, timestamp } = JSON.parse(cached);
                const isExpired = Date.now() - timestamp > CACHE_DURATION;
                
                if (!isExpired) {
                    console.log('📦 Dados carregados do cache');
                    setData(cachedData);
                    setLastUpdated(new Date(timestamp));
                    return true;
                }
            }
        } catch (error) {
            console.warn('⚠️ Erro ao carregar cache:', error);
        }
        return false;
    }, []);

    // Salva dados no cache
    const saveToCache = useCallback((newData) => {
        try {
            const cacheData = {
                data: newData,
                timestamp: Date.now()
            };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
            console.log('💾 Dados salvos no cache');
        } catch (error) {
            console.warn('⚠️ Erro ao salvar cache:', error);
        }
    }, []);

    // Limpa o cache
    const clearCache = useCallback(() => {
        try {
            localStorage.removeItem(CACHE_KEY);
            console.log('🗑️ Cache limpo');
            return true;
        } catch (error) {
            console.warn('⚠️ Erro ao limpar cache:', error);
            return false;
        }
    }, []);

    // Requisição da API
    const apiRequest = useCallback(async (action, retries = 2) => {
        const url = `${apiConfig.baseUrl}/player_api.php?username=${apiConfig.username}&password=${apiConfig.password}&action=${action}`;
        
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                if (apiConfig.debugMode) {
                    console.log(`📡 API Request (${attempt}/${retries}): ${action}`);
                }
                
                if (!window.electronAPI?.fetchData) {
                    throw new Error('Electron API não disponível');
                }

                const response = await window.electronAPI.fetchData(url, {
                    timeout: apiConfig.timeout
                });

                if (response.status >= 200 && response.status < 300) {
                    if (apiConfig.debugMode) {
                        console.log(`✅ Sucesso: ${action} (${Array.isArray(response.data) ? response.data.length : 0} itens)`);
                    }
                    return Array.isArray(response.data) ? response.data : [];
                } else {
                    throw new Error(`HTTP ${response.status}`);
                }
                
            } catch (error) {
                console.warn(`⚠️ Tentativa ${attempt} falhou para ${action}:`, error.message);
                
                if (attempt === retries) {
                    throw error;
                }
                
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        }
    }, [apiConfig]);

    // Carrega todos os dados da API
    const loadAllData = useCallback(async (forceRefresh = false) => {
        // Se não forçar refresh, tenta carregar do cache primeiro
        if (!forceRefresh && loadFromCache()) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log('🔄 Carregando dados da API...');

            const requests = [
                { key: 'movies', action: 'get_vod_streams' },
                { key: 'movieCategories', action: 'get_vod_categories' },
                { key: 'channels', action: 'get_live_streams' },
                { key: 'channelCategories', action: 'get_live_categories' },
                { key: 'series', action: 'get_series' },
                { key: 'seriesCategories', action: 'get_series_categories' }
            ];

            const results = {};
            let completed = 0;
            
            // Executa em lotes para mostrar progresso
            const batchSize = 2;
            for (let i = 0; i < requests.length; i += batchSize) {
                const batch = requests.slice(i, i + batchSize);
                
                const batchResults = await Promise.allSettled(
                    batch.map(async ({ key, action }) => {
                        try {
                            const data = await apiRequest(action);
                            completed++;
                            console.log(`✅ ${key}: ${data.length} itens (${completed}/${requests.length})`);
                            return { key, data, success: true };
                        } catch (error) {
                            completed++;
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
                    await new Promise(resolve => setTimeout(resolve, 500));
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
            setLastUpdated(new Date());
            saveToCache(results);

        } catch (error) {
            console.error('❌ Erro crítico no carregamento:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [apiRequest, loadFromCache, saveToCache]);

    // Constrói URL de stream
    const buildStreamUrl = useCallback((content, type) => {
        try {
            switch (type) {
                case 'movie':
                    return `${apiConfig.baseUrl}/movie/${apiConfig.username}/${apiConfig.password}/${content.stream_id}.${content.container_extension || 'mp4'}`;
                
                case 'series':
                    return content.stream_url || content.url;
                
                case 'live':
                    return `${apiConfig.baseUrl}/live/${apiConfig.username}/${apiConfig.password}/${content.stream_id}.${content.stream_type || 'm3u8'}`;
                
                default:
                    throw new Error(`Tipo inválido: ${type}`);
            }
        } catch (error) {
            console.error('❌ Erro ao construir URL:', error);
            return null;
        }
    }, [apiConfig]);

    // Valida credenciais na inicialização
    useEffect(() => {
        const validation = validateCredentials(apiConfig);
        if (!validation.isValid) {
            console.error('❌ Credenciais inválidas:', validation.errors);
            setError(`Credenciais inválidas: ${validation.errors.join(', ')}`);
        } else {
            // Carrega dados automaticamente
            loadAllData();
        }
    }, [apiConfig, loadAllData]);

    return {
        data,
        loading,
        error,
        lastUpdated,
        loadAllData,
        clearCache,
        buildStreamUrl,
        apiRequest
    };
};