// --- ARQUIVO COMPLETO E FINAL: src/components/LoadingScreen.jsx ---

import React from 'react';

const LoadingScreen = ({ message = "Carregando..." }) => {
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-sharkBg text-white">
            <div className="relative w-80 h-80">
                <div className="absolute inset-0 bg-sharkBlue rounded-full opacity-20 animate-ping"></div>
                <div className="relative flex justify-center items-center w-full h-full">
                    <img 
                        src="/logo.png"
                        alt="SharkTV Logo" 
                        className="w-72 h-auto"
                    />
                </div>
            </div>
            <p className="text-lg text-gray-400 mt-4">{message}</p>
        </div>
    );
};

export default LoadingScreen;