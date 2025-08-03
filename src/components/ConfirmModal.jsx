// --- ARQUIVO COMPLETO PARA SUBSTITUIR: src/components/ConfirmModal.jsx ---

import React from 'react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    return (
        <div 
            className={`fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={onCancel}
        >
            <div 
                className="bg-sharkSurface p-6 rounded-lg shadow-xl w-full max-w-sm"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
                <p className="text-gray-300 mb-6">{message}</p>
                <div className="flex justify-end gap-4">
                    <button 
                        onClick={onCancel}
                        className="px-4 py-2 bg-sharkBg text-white rounded-md font-semibold hover:bg-opacity-80"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="px-4 py-2 bg-sharkRed text-white rounded-md font-bold hover:bg-opacity-80"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;