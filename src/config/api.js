// src/config/api.js - Configuração segura da API
export const getAPIConfig = () => {
    // Tenta carregar das variáveis de ambiente primeiro
    const envConfig = {
        baseUrl: import.meta.env.VITE_IPTV_BASE_URL,
        username: import.meta.env.VITE_IPTV_USERNAME,
        password: import.meta.env.VITE_IPTV_PASSWORD,
        timeout: parseInt(import.meta.env.VITE_IPTV_TIMEOUT) || 30000,
        debugMode: import.meta.env.VITE_DEBUG_MODE === 'true'
    };

    // Fallback para desenvolvimento local (dados mock)
    const fallbackConfig = {
        baseUrl: 'http://demo-iptv-server.com',
        username: 'demo_user',
        password: 'demo_pass',
        timeout: 30000,
        debugMode: true
    };

    // Verifica se as credenciais estão configuradas
    const isConfigured = envConfig.baseUrl && envConfig.username && envConfig.password;
    
    if (!isConfigured) {
        console.warn('⚠️ Credenciais IPTV não configuradas. Usando dados de demonstração.');
        console.info('💡 Configure o arquivo .env com suas credenciais reais.');
        return fallbackConfig;
    }

    // Log seguro (sem mostrar credenciais)
    if (envConfig.debugMode) {
        console.log('🔧 Configuração IPTV carregada:', {
            baseUrl: envConfig.baseUrl,
            username: maskCredential(envConfig.username),
            password: maskCredential(envConfig.password),
            timeout: envConfig.timeout
        });
    }

    return envConfig;
};

// Função para mascarar credenciais nos logs
const maskCredential = (credential) => {
    if (!credential || credential.length < 4) return '****';
    return credential.substring(0, 2) + '*'.repeat(credential.length - 4) + credential.slice(-2);
};

// Valida se as credenciais estão corretas
export const validateCredentials = (config) => {
    const errors = [];
    
    if (!config.baseUrl || !config.baseUrl.startsWith('http')) {
        errors.push('URL base inválida');
    }
    
    if (!config.username || config.username.length < 3) {
        errors.push('Username inválido');
    }
    
    if (!config.password || config.password.length < 3) {
        errors.push('Password inválido');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

// Configuração padrão exportada
export default getAPIConfig();