// --- NOVO ARQUIVO: src/components/ScrollToTopButton.jsx ---

import React, { useState, useEffect } from 'react';

const ScrollToTopButton = ({ scrollContainerRef }) => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        // Usa o contêiner de scroll principal, se fornecido, senão o window
        const container = scrollContainerRef?.current;
        if (container) {
            if (container.scrollTop > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        } else {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        }
    };

    const scrollToTop = () => {
        const container = scrollContainerRef?.current;
        if (container) {
            container.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        const container = scrollContainerRef?.current || window;
        container.addEventListener('scroll', toggleVisibility);
        return () => {
            container.removeEventListener('scroll', toggleVisibility);
        };
    }, [scrollContainerRef]);

    return (
        <div className="fixed bottom-6 right-6 z-40">
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="bg-sharkBlue text-black rounded-full p-3 shadow-lg hover:bg-opacity-80 focus:outline-none focus:ring-4 focus:ring-sharkBlue/50 transition-all duration-300"
                    aria-label="Voltar ao topo"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default ScrollToTopButton;