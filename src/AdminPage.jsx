import React from 'react';
import { Link } from 'react-router-dom';

const AdminPage = () => {
    // No futuro, você pode adicionar aqui a lógica para gerenciar
    // configurações da aplicação que seriam salvas no localStorage,
    // ou outras ferramentas de administração.

    return (
        <div className="p-4 sm:p-6 md:p-10 max-w-6xl mx-auto text-white min-h-screen bg-sharkBg">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold">Painel do Administrador</h1>
                <Link 
                    to="/" 
                    className="px-4 py-2 bg-sharkBlue text-sharkBg font-bold rounded hover:bg-opacity-80 transition-colors"
                >
                    Voltar ao Player
                </Link>
            </div>

            <div className="bg-sharkSurface p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Bem-vindo ao Painel de Administração</h2>
                <p className="text-gray-400">
                    Esta área está reservada para futuras funcionalidades de administração.
                </p>
                <p className="text-gray-400 mt-2">
                    Como a aplicação agora opera sem um backend central, o gerenciamento de usuários
                    foi removido. O login é feito diretamente com a URL da lista M3U.
                </p>
            </div>
        </div>
    );
};

export default AdminPage;