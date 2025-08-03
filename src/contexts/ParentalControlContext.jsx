// --- ARQUIVO NOVO: src/contexts/ParentalControlContext.jsx ---

import React, { createContext, useState, useContext, useMemo } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const ParentalControlContext = createContext(null);

export const ParentalControlProvider = ({ children }) => {
    const [isPinModalOpen, setIsPinModalOpen] = useState(false);
    const [pin, setPin] = useState(() => localStorage.getItem('sharktv_parental_pin') || null);
    const [isLocked, setIsLocked] = useState(!!pin); // Começa bloqueado se um PIN já existir

    const openPinSettings = () => {
        setIsPinModalOpen(true);
    };

    const closePinSettings = () => {
        setIsPinModalOpen(false);
    };

    const handleSetPin = (newPin) => {
        if (newPin && newPin.length === 4) {
            localStorage.setItem('sharktv_parental_pin', newPin);
            setPin(newPin);
            setIsLocked(true);
            toast.success('PIN de Controle dos Pais ativado!');
            closePinSettings();
        } else {
            toast.error('O PIN deve ter 4 dígitos.');
        }
    };

    const handleRemovePin = () => {
        localStorage.removeItem('sharktv_parental_pin');
        setPin(null);
        setIsLocked(false);
        toast.success('PIN de Controle dos Pais desativado.');
        closePinSettings();
    };

    const handleUnlock = (attempt) => {
        if (attempt === pin) {
            setIsLocked(false);
            toast.success('Conteúdo desbloqueado.');
            return true;
        } else {
            toast.error('PIN incorreto.');
            return false;
        }
    };

    const value = useMemo(() => ({
        isLocked,
        pin,
        openPinSettings,
        handleUnlock
    }), [isLocked, pin]);

    return (
        <ParentalControlContext.Provider value={value}>
            {/* Toaster é o componente que mostra as notificações (toast) */}
            <Toaster position="top-center" reverseOrder={false} />
            
            {children}
            
            {/* Modal para configurar o PIN */}
            {isPinModalOpen && (
                <PinSettingsModal
                    currentPin={pin}
                    onClose={closePinSettings}
                    onSetPin={handleSetPin}
                    onRemovePin={handleRemovePin}
                />
            )}
        </ParentalControlContext.Provider>
    );
};

// Componente do Modal (incluído aqui para simplificar)
const PinSettingsModal = ({ currentPin, onClose, onSetPin, onRemovePin }) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSetPin(input);
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-sharkSurface p-8 rounded-lg text-white w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6 text-center">Controle dos Pais</h2>
                {currentPin ? (
                    <div>
                        <p className="text-center mb-4">O Controle dos Pais está ATIVADO.</p>
                        <p className="text-center mb-6 text-gray-400">PIN atual: ****</p>
                        <button 
                            onClick={onRemovePin} 
                            className="w-full p-3 bg-sharkRed rounded font-bold hover:bg-opacity-80"
                        >
                            Desativar PIN
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <p className="text-center mb-4">Defina um PIN de 4 dígitos para restringir o conteúdo.</p>
                        <input
                            type="password"
                            maxLength="4"
                            value={input}
                            onChange={(e) => setInput(e.target.value.replace(/\D/g, ''))} // Permite apenas números
                            placeholder="Digite o novo PIN"
                            className="w-full p-3 bg-sharkBg text-center text-2xl tracking-[.5em] rounded mb-6 outline-none focus:ring-2 ring-sharkBlue"
                        />
                        <button 
                            type="submit" 
                            className="w-full p-3 bg-sharkBlue text-black rounded font-bold hover:bg-opacity-80"
                        >
                            Salvar e Ativar PIN
                        </button>
                    </form>
                )}
                 <button onClick={onClose} className="absolute top-4 right-4 text-3xl hover:text-gray-400">×</button>
            </div>
        </div>
    );
};


export const useParentalControl = () => {
    const context = useContext(ParentalControlContext);
    if (!context) {
        throw new Error('useParentalControl deve ser usado dentro de um ParentalControlProvider');
    }
    return context;
};