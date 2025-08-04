// src/hooks/useIPTVAPI.js
import { useIPTVCache } from './useIPTVCache';

export const useIPTVAPI = () => {
    const { data, loading, error, lastUpdated, loadAllData, clearCache, buildStreamUrl } = useIPTVCache();
    
    return {
        data,
        loading,
        error,
        lastUpdated,
        loadAllData,
        clearCache,
        buildStreamUrl
    };
};
};