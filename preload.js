// --- ARQUIVO APRIMORADO: preload.js ---

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Proxy para streams
  startProxy: (streamUrl, type) => ipcRenderer.invoke('start-proxy', streamUrl, type),
  stopProxy: () => ipcRenderer.send('stop-proxy'),
  
  // Requisições HTTP para metadados (resolve CORS)
  fetchData: (url, options = {}) => ipcRenderer.invoke('fetch-data', url, options),
  
  // Informações do sistema
  getVersion: () => ipcRenderer.invoke('get-version'),
  
  // Controles da janela
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  maximizeWindow: () => ipcRenderer.send('maximize-window'),
  closeWindow: () => ipcRenderer.send('close-window'),
});