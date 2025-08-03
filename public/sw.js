// --- NOVO ARQUIVO: public/sw.js ---

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Intercepta apenas as requisições que o nosso app marcar para o proxy
  if (url.pathname === '/sw-proxy') {
    const targetUrl = url.searchParams.get('url');
    if (!targetUrl) {
      event.respondWith(new Response('URL de destino não fornecida', { status: 400 }));
      return;
    }

    // Cria uma nova requisição com cabeçalhos modificados
    const newHeaders = new Headers(event.request.headers);
    newHeaders.set('User-Agent', 'VLC/3.0.11'); // Simula um player conhecido
    // O navegador vai gerenciar o Range header automaticamente

    const newRequest = new Request(targetUrl, {
      method: event.request.method,
      headers: newHeaders,
      mode: 'cors', // Essencial para requisições entre domínios diferentes
      redirect: 'follow' // Pede ao navegador para seguir os redirecionamentos
    });
    
    // Responde à requisição original com o resultado da busca pela URL de destino
    event.respondWith(fetch(newRequest));
  }
});