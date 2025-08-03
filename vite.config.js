// --- ARQUIVO COMPLETO E FINAL: sharktv-frontend/vite.config.js ---

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Define o caminho base como relativo, essencial para o Electron.
  base: './', 
  build: {
    // A correção está aqui: 'build' deve ser uma string.
    // Isso garante que o Vite crie uma pasta chamada 'build'.
    outDir: 'build', 
    emptyOutDir: true,
  },
});