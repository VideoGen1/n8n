// Lightweight Cloudflare Worker to proxy API requests to an external n8n backend.
// Forward /api/* to the API backend defined by the API_BASE_URL env var.
//
// Notes:
// - Do NOT store secrets in code. Provide API_BASE_URL via GitHub Actions secret or
//   set it in your Cloudflare Worker environment variables.
// - Adjust header handling, auth passthrough, CORS, and other security logic as needed.

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);

      // Health check
      if (url.pathname === '/_health') {
        return new Response('ok', { status: 200, headers: { 'Content-Type': 'text/plain' } });
      }

      const API_PREFIX = '/api';
      if (url.pathname.startsWith(API_PREFIX)) {
        const apiBase = env.API_BASE_URL || 'https://example.com';
        const targetUrl = new URL(apiBase);

        // preserve path and query
        targetUrl.pathname = url.pathname;
        targetUrl.search = url.search;

        // Clone request headers and method/body
        const forwardedHeaders = new Headers(request.headers);
        // Add a header to indicate the request passed through Cloudflare Worker
        forwardedHeaders.set('x-forwarded-by', 'cloudflare-worker');

        // Create a new Request to the backend
        const forwardedRequest = new Request(targetUrl.toString(), {
          method: request.method,
          headers: forwardedHeaders,
          body: request.body,
          redirect: 'manual',
        });

        // Proxy the request and return backend response as-is
        const resp = await fetch(forwardedRequest);
        return resp;
      }

      // Default: Not Found
      return new Response('Not Found', { status: 404 });
    } catch (err) {
      return new Response('Worker Error: ' + String(err), { status: 500 });
    }
  }
}