import http from 'node:http';
import { stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public');
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '0.0.0.0';
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be 1–65535');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };
function reply(req, res, status, text, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', ...headers });
  res.end(req.method === 'HEAD' ? undefined : text);
}
const server = http.createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (!['GET', 'HEAD'].includes(req.method)) return reply(req, res, 405, 'Method not allowed', { Allow: 'GET, HEAD' });
  let pathname, search;
  try {
    const url = new URL(req.url, 'http://localhost');
    pathname = decodeURIComponent(url.pathname);
    search = url.search;
  } catch { return reply(req, res, 400, 'Bad request'); }
  if (pathname === '/health') return reply(req, res, 200, 'ok');
  if (pathname.includes('\0') || pathname.includes('\\')) return reply(req, res, 400, 'Bad request');
  let filename = path.resolve(root, '.' + pathname);
  if (filename !== root && !filename.startsWith(root + path.sep)) return reply(req, res, 403, 'Forbidden');
  try {
    let info = await stat(filename);
    if (info.isDirectory()) {
      if (!pathname.endsWith('/')) return reply(req, res, 301, 'Redirecting', { Location: encodeURI(pathname + '/') + search });
      filename = path.join(filename, 'index.html');
      info = await stat(filename);
    }
    if (!info.isFile()) return reply(req, res, 404, 'Not found');
    res.writeHead(200, { 'Content-Type': types[path.extname(filename).toLowerCase()] || 'application/octet-stream', 'Content-Length': info.size, 'Cache-Control': filename.endsWith('.html') ? 'no-cache' : 'public, max-age=3600' });
    if (req.method === 'HEAD') return res.end();
    const stream = createReadStream(filename);
    stream.on('error', () => res.destroy());
    stream.pipe(res);
  } catch (error) {
    reply(req, res, ['ENOENT', 'ENOTDIR'].includes(error.code) ? 404 : 500, 'Not found');
  }
});
server.listen(port, host, () => console.log(`WOU cybercrime website: http://localhost:${port}`));
server.on('error', error => { console.error(error.message); process.exit(1); });
for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => { server.close(() => process.exit(0)); setTimeout(() => process.exit(0), 5000).unref(); });
