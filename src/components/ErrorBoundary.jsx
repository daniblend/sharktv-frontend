// --- ARQUIVO COMPLETO E CORRIGIDO: src/components/ErrorBoundary.jsx ---

import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error: error };
    }

    componentDidCatch(error, errorInfo) {
        // Usa a nossa nova API de log personalizada.
        if (window.customLogger && typeof window.customLogger.log === 'function') {
            window.customLogger.log(
                'error', 
                'React Rendering Error:', 
                error.toString(), 
                errorInfo.componentStack
            );
        }
        // Também mantém o log no console para depuração em tempo real.
        console.error('React Rendering Error Capturado pelo ErrorBoundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', color: 'white', backgroundColor: '#1A1D1F', height: '100vh' }}>
                    <h1>Ocorreu um Erro na Aplicação</h1>
                    <p>Um erro crítico impediu o carregamento da aplicação. Os detalhes foram registrados no arquivo <strong>log.txt</strong> na pasta do projeto.</p>
                    <p>Por favor, reinicie a aplicação e verifique o arquivo de log.</p>
                    <pre style={{ marginTop: '1rem', color: '#E53935', whiteSpace: 'pre-wrap' }}>
                        {this.state.error && this.state.error.toString()}
                    </pre>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;