// --- ARQUIVO COMPLETO PARA SUBSTITUIR: src/components/ParentalControlModal.jsx ---

import React from 'react';
import { useParentalControl } from '../contexts/ParentalControlContext';

const ParentalControlModal = ({ isOpen, onClose }) => {
    const { isLocked, hasPin, setIsPinModalOpen, setPinAction } = useParentalControl();

    return (
        <div 
            className={`fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
        >
            <div className="bg-sharkSurface p-6 rounded-lg shadow-xl w-full max-w-sm text-white" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Controle Parental</h2>
                    <button onClick={onClose} className="text-3xl hover:text-sharkBlue transition-colors">×</button>
                </div>
                
                <p className="mb-4 text-gray-300">
                    {hasPin ? `O bloqueio de conteúdo está ${isLocked ? 'ATIVADO' : 'DESATIVADO'}.` : 'Nenhum PIN foi configurado.'}
                </p>

                <div className="flex flex-col gap-3">
                    {!isLocked && hasPin && (
                        <button onClick={() => window.location.reload()} className="w-full p-3 bg-sharkBlue text-black font-bold rounded-md">Ativar Bloqueio</button>
                    )}
                    {isLocked && hasPin && (
                        <button onClick={() => { setPinAction('unlock'); setIsPinModalOpen(true); onClose(); }} className="w-full p-3 bg-sharkBlue text-black font-bold rounded-md">Desativar Bloqueio</button>
                    )}
                    
                    <button onClick={() => { setPinAction('set'); setIsPinModalOpen(true); onClose(); }} className="w-full p-3 bg-sharkBg rounded-md hover:bg-sharkBg/70">
                        {hasPin ? 'Alterar PIN' : 'Criar PIN'}
                    </button>
                    
                    {hasPin && (
                         <button onClick={() => { setPinAction('disable'); setIsPinModalOpen(true); onClose(); }} className="w-full p-3 bg-sharkRed/80 text-white font-semibold rounded-md hover:bg-sharkRed">Remover PIN</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ParentalControlModal;