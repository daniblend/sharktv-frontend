// --- ARQUIVO CORRIGIDO: electron.cjs ---

const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('node:path');
const http = require('http');
const https = require('https');
const { URL } = require('url');

const isDev = !app.isPackaged;
let mainWindow;
let proxyServer;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    fullscreen: true,
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  
  const startUrl = isDev ? 'http://localhost:5173' : `file://${path.join(__dirname, '../dist/index.html')}`;
  mainWindow.loadURL(startUrl);
  if (isDev) mainWindow.webContents.openDevTools({ mode: 'detach' });
}

function registerShortcuts() {
  globalShortcut.register('Escape', () => mainWindow?.isFullScreen() && mainWindow.setFullScreen(false));
  globalShortcut.register('Alt+Enter', () => mainWindow && mainWindow.setFullScreen(!mainWindow.isFullScreen()));
}

function getFreePort() {
  return new Promise(resolve => {
    const server = http.createServer();
    server.listen(0, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
  });
}

// Função melhorada para requisições HTTP
const makeHttpRequest = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const requestOptions = {
      timeout: 30000,
      headers: {
        'User-Agent': 'VLC/3.0.11 LibVLC/3.0.11',
        'Accept': '*/*',
        'Connection': 'keep-alive',
        ...options.headers
      }
    };

    console.log(`🌐 HTTP Request: ${url}`);

    const request = protocol.get(url, requestOptions, (response) => {
      console.log(`📡 Response: ${response.statusCode} - ${url}`);
      
      // Trata redirecionamentos
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        const redirectUrl = new URL(response.headers.location, url).href;
        console.log(`🔀 Redirect: ${url} -> ${redirectUrl}`);
        return makeHttpRequest(redirectUrl, options).then(resolve).catch(reject);
      }

      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        resolve({
          statusCode: response.statusCode,
          headers: response.headers,
          data: data
        });
      });
    });

    request.on('error', (error) => {
      console.error(`❌ Request Error: ${error.message} - ${url}`);
      reject(error);
    });

    request.on('timeout', () => {
      console.error(`⏰ Request Timeout: ${url}`);
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
};

// Stream proxy melhorado
const streamRequest = (url, clientRes, maxRedirects = 5) => {
  if (maxRedirects < 0) {
    console.error('❌ Too many redirects');
    if (!clientRes.headersSent) {
      clientRes.writeHead(500, { 'Content-Type': 'text/plain' });
      clientRes.end('Too many redirects');
    }
    return;
  }

  const protocol = url.startsWith('https') ? https : http;
  const options = {
    timeout: 30000,
    headers: {
      'User-Agent': 'VLC/3.0.11 LibVLC/3.0.11',
      'Accept': '*/*',
      'Connection': 'keep-alive'
    }
  };

  console.log(`🎬 Stream Request: ${url}`);

  const proxyReq = protocol.get(url, options, (proxyRes) => {
    console.log(`📺 Stream Response: ${proxyRes.statusCode} - ${url}`);

    // Trata redirecionamentos
    if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
      const redirectUrl = new URL(proxyRes.headers.location, url).href;
      console.log(`🔀 Stream Redirect: ${url} -> ${redirectUrl}`);
      return streamRequest(redirectUrl, clientRes, maxRedirects - 1);
    }

    // Copia headers, removendo alguns problemáticos
    const headers = { ...proxyRes.headers };
    delete headers['access-control-allow-origin'];
    delete headers['access-control-allow-methods'];
    delete headers['access-control-allow-headers'];

    if (!clientRes.headersSent) {
      clientRes.writeHead(proxyRes.statusCode, headers);
    }
    
    proxyRes.pipe(clientRes);
    
    proxyRes.on('error', (err) => {
      console.error(`❌ Stream Response Error: ${err.message}`);
      if (!clientRes.destroyed) {
        clientRes.destroy();
      }
    });
  });

  proxyReq.on('error', (err) => {
    console.error(`❌ Stream Request Error: ${err.message} - ${url}`);
    if (!clientRes.headersSent) {
      clientRes.writeHead(502, { 'Content-Type': 'text/plain' });
      clientRes.end(`Stream error: ${err.message}`);
    }
  });

  proxyReq.on('timeout', () => {
    console.error(`⏰ Stream Request Timeout: ${url}`);
    proxyReq.destroy();
    if (!clientRes.headersSent) {
      clientRes.writeHead(504, { 'Content-Type': 'text/plain' });
      clientRes.end('Stream timeout');
    }
  });
};

// Handler do proxy de streams
ipcMain.handle('start-proxy', async (event, streamUrl, type) => {
  try {
    console.log(`🚀 Starting Proxy - Type: ${type}, URL: ${streamUrl}`);
    
    if (proxyServer) {
      console.log('🛑 Closing existing proxy server');
      proxyServer.close();
      proxyServer = null;
    }
    
    const port = await getFreePort();
    const localBaseUrl = `http://localhost:${port}`;
    console.log(`🌐 Proxy server starting on port ${port}`);

    proxyServer = http.createServer((clientReq, clientRes) => {
      // Headers CORS
      clientRes.setHeader('Access-Control-Allow-Origin', '*');
      clientRes.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      clientRes.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      if (clientReq.method === 'OPTIONS') {
        clientRes.writeHead(200);
        clientRes.end();
        return;
      }

      console.log(`📥 Proxy Request: ${clientReq.method} ${clientReq.url}`);

      try {
        if (type === 'movie' || type === 'series') {
          // Stream direto para filmes e séries
          streamRequest(streamUrl, clientRes);
          return;
        }

        // Para live streams (HLS)
        const requestUrl = new URL(clientReq.url, localBaseUrl);
        const isSegmentRequest = requestUrl.pathname === '/segment';
        const targetUrl = isSegmentRequest ? requestUrl.searchParams.get('url') : streamUrl;

        if (!targetUrl) {
          console.error('❌ No target URL found');
          clientRes.writeHead(400, { 'Content-Type': 'text/plain' });
          clientRes.end('Target URL not found');
          return;
        }

        if (isSegmentRequest) {
          // Requisição de segmento HLS
          streamRequest(targetUrl, clientRes);
        } else {
          // Requisição de playlist HLS
          makeHttpRequest(targetUrl)
            .then(response => {
              if (response.statusCode !== 200) {
                throw new Error(`HTTP ${response.statusCode}`);
              }

              const baseUrl = targetUrl;
              const playlist = response.data;
              
              console.log(`📝 Processing playlist (${playlist.length} chars)`);

              const rewrittenPlaylist = playlist.split('\n').map(line => {
                const trimmedLine = line.trim();
                if (trimmedLine && !trimmedLine.startsWith('#')) {
                  try {
                    const absoluteUrl = new URL(trimmedLine, baseUrl).href;
                    return `/segment?url=${encodeURIComponent(absoluteUrl)}`;
                  } catch (e) {
                    console.warn(`⚠️ Error processing playlist line: ${trimmedLine}`);
                    return line;
                  }
                }
                return line;
              }).join('\n');

              clientRes.writeHead(200, {
                'Content-Type': 'application/vnd.apple.mpegurl',
                'Cache-Control': 'no-cache'
              });
              clientRes.end(rewrittenPlaylist);
            })
            .catch(error => {
              console.error(`❌ Playlist Error: ${error.message}`);
              clientRes.writeHead(500, { 'Content-Type': 'text/plain' });
              clientRes.end(`Playlist error: ${error.message}`);
            });
        }
      } catch (error) {
        console.error(`❌ Proxy Handler Error: ${error.message}`);
        if (!clientRes.headersSent) {
          clientRes.writeHead(500, { 'Content-Type': 'text/plain' });
          clientRes.end(`Proxy error: ${error.message}`);
        }
      }
    });

    proxyServer.on('error', (error) => {
      console.error(`❌ Proxy Server Error: ${error.message}`);
    });

    return new Promise((resolve, reject) => {
      proxyServer.listen(port, (error) => {
        if (error) {
          console.error(`❌ Failed to start proxy on port ${port}:`, error);
          reject(error);
        } else {
          console.log(`✅ Proxy server running on ${localBaseUrl}`);
          resolve(localBaseUrl);
        }
      });
    });

  } catch (error) {
    console.error(`❌ Start Proxy Error: ${error.message}`);
    throw error;
  }
});

// Handler para requisições de dados
ipcMain.handle('fetch-data', async (event, url, options = {}) => {
  try {
    console.log(`📊 Fetch Data: ${url}`);
    
    const response = await makeHttpRequest(url, options);
    
    let parsedData = response.data;
    if (response.headers['content-type']?.includes('application/json')) {
      try {
        parsedData = JSON.parse(response.data);
      } catch (e) {
        console.warn('⚠️ Failed to parse JSON, returning raw data');
      }
    }

    return {
      status: response.statusCode,
      data: parsedData,
      headers: response.headers
    };

  } catch (error) {
    console.error(`❌ Fetch Data Error: ${error.message}`);
    throw error;
  }
});

// Cleanup handlers
ipcMain.on('stop-proxy', () => {
  if (proxyServer) {
    console.log('🛑 Stopping proxy server');
    proxyServer.close();
    proxyServer = null;
  }
});

ipcMain.handle('get-version', () => app.getVersion());

// Window controls
ipcMain.on('minimize-window', () => mainWindow?.minimize());
ipcMain.on('maximize-window', () => {
  if (mainWindow) {
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
  }
});
ipcMain.on('close-window', () => mainWindow?.close());

// App lifecycle
app.whenReady().then(() => {
  createWindow();
  registerShortcuts();
  app.on('activate', () => BrowserWindow.getAllWindows().length === 0 && createWindow());
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
  if (proxyServer) {
    proxyServer.close();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Logs de inicialização
console.log('🚀 SharkTV Electron App Starting...');
console.log(`📦 Version: ${app.getVersion()}`);
console.log(`🔧 Development Mode: ${isDev}`);
console.log(`📁 App Path: ${app.getAppPath()}`);