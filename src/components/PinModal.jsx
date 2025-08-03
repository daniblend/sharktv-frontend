// --- ARQUIVO COMPLETO E CORRIGIDO: src/components/PinModal.jsx ---

import React, { useState, useEffect } from 'react';

const PinModal = ({ isOpen, onClose, action, hasPin, onUnlock, onSetPin, onDisable, currentPin }) => {
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [error, setError] = useState('');
    const [step, setStep] = useState('initial'); // 'initial', 'confirm', 'new'
    const [prompt, setPrompt] = useState('');

    useEffect(() => {
        if (isOpen) {
            setPin('');
            setConfirmPin('');
            setError('');
            
            if (action === 'unlock') {
                setPrompt('Digite o PIN para desbloquear');
                setStep('initial');
            } else if (action === 'settings') {
                if (hasPin) {
                    setPrompt('Digite o PIN atual para alterar');
                    setStep('verify');
                } else {
                    setPrompt('Crie um PIN de 4 dígitos');
                    setStep('new');
                }
            }
        }
    }, [isOpen, action, hasPin]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (pin.length !== 4) return setError('O PIN deve ter 4 dígitos.');

        if (action === 'unlock') {
            if (!onUnlock(pin)) setError('PIN incorreto.');
        } else if (action === 'settings') {
            if (step === 'verify') {
                if (pin === currentPin) {
                    setStep('new');
                    setPrompt('Digite o novo PIN');
                    setPin('');
                } else {
                    setError('PIN atual incorreto.');
                }
            } else if (step === 'new') {
                setStep('confirm');
                setConfirmPin(pin);
                setPin('');
                setPrompt('Confirme o novo PIN');
            } else if (step === 'confirm') {
                if (pin === confirmPin) {
                    onSetPin(pin);
                } else {
                    setError('Os PINs não correspondem.');
                    setStep('new');
                    setPrompt('Crie um PIN de 4 dígitos');
                    setConfirmPin('');
                    setPin('');
                }
            }
        }
    };
    
    return (
        <div className={`fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}>
            <div className="bg-sharkSurface p-6 rounded-lg shadow-xl w-full max-w-xs" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-white mb-4 text-center">{prompt}</h2>
                <form onSubmit={handleSubmit}>
                    <input type="password" pattern="\d{4}" maxLength="4" value={pin} onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))} className="w-full p-3 text-center text-3xl tracking-[1em] bg-sharkBg rounded-md text-white outline-none focus:ring-2 focus:ring-sharkBlue" autoFocus />
                    {error && <p className="text-sharkRed text-center mt-2 h-4">{error}</p>}
                    <button type="submit" className="w-full mt-4 p-3 bg-sharkBlue text-black font-bold rounded-md hover:bg-opacity-80">Confirmar</button>
                    {hasPin && action === 'settings' && step === 'verify' && (
                        <button type="button" onClick={onDisable} className="w-full mt-2 p-2 text-sharkRed text-sm hover:underline">Remover PIN</button>
                    )}
                </form>
            </div>
        </div>
    );
};
export default PinModal;