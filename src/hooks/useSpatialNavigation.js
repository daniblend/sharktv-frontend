// --- ARQUIVO COMPLETO E FINAL: src/hooks/useSpatialNavigation.js ---

import { useEffect } from 'react';

const SELECTOR = 'a[href], button, input, [tabindex]:not([tabindex="-1"])';

export const useSpatialNavigation = (containerRef, options = {}) => {
    const { enabled = true, initialFocus = false } = options;

    useEffect(() => {
        if (!enabled || !containerRef.current) return;
        
        const container = containerRef.current;

        const handleKeyDown = (e) => {
            if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
            
            const elements = Array.from(container.querySelectorAll(SELECTOR))
                .filter(el => el.offsetParent !== null);

            if (elements.length === 0) return;

            e.preventDefault();

            let currentIndex = elements.findIndex(el => el === document.activeElement);

            if (currentIndex === -1) {
                elements[0].focus();
                return;
            }

            const currentElement = elements[currentIndex];
            const rect = currentElement.getBoundingClientRect();
            
            const itemsPerRow = Math.max(1, Math.floor(container.clientWidth / (rect.width + 24)));
            let nextIndex = currentIndex;

            switch (e.key) {
                case 'ArrowUp':
                    nextIndex = Math.max(0, currentIndex - itemsPerRow);
                    break;
                case 'ArrowDown':
                    nextIndex = Math.min(elements.length - 1, currentIndex + itemsPerRow);
                    break;
                case 'ArrowLeft':
                    nextIndex = Math.max(0, currentIndex - 1);
                    break;
                case 'ArrowRight':
                    nextIndex = Math.min(elements.length - 1, currentIndex + 1);
                    break;
                default:
                    return;
            }

            if (elements[nextIndex]) {
                elements[nextIndex].focus();
            }
        };

        if (initialFocus) {
            const focusableElements = Array.from(container.querySelectorAll(SELECTOR))
                .filter(el => el.offsetParent !== null);
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);

    }, [enabled, containerRef, initialFocus]);
};