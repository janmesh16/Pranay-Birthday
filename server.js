import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, 'dist');
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  // Only allow GET and HEAD requests
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    return res.end('Method Not Allowed');
  }

  // Sanitize and resolve file path
  let decodedUrl;
  try {
    decodedUrl = decodeURIComponent(req.url.split('?')[0]);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    return res.end('Bad Request');
  }

  let safePath = path.normalize(decodedUrl).replace(/^(\.\.[/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  let filePath = path.join(DIST_DIR, safePath);

  // Check if file exists in dist
  fs.stat(filePath, (err, stats) => {
    // If not found or is a directory, fallback to SPA index.html
    if (err || stats.isDirectory()) {
      filePath = path.join(DIST_DIR, 'index.html');
      return serveFile(req, res, filePath, true);
    }

    serveFile(req, res, filePath, false, stats);
  });
});

function serveFile(req, res, filePath, isSpaFallback = false, existingStats = null) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  const sendResponse = (stats) => {
    const totalSize = stats.size;
    const rangeHeader = req.headers.range;

    // Set caching headers
    const headers = {
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes',
      'X-Content-Type-Options': 'nosniff'
    };

    if (filePath.includes('/assets/')) {
      // Fingerprinted assets cached aggressively for 1 year
      headers['Cache-Control'] = 'public, max-age=31536000, immutable';
    } else if (isSpaFallback || ext === '.html') {
      // HTML files always revalidated so updates are seen instantly
      headers['Cache-Control'] = 'no-cache';
    } else {
      headers['Cache-Control'] = 'public, max-age=86400';
    }

    // Handle HTTP Range Requests (essential for iOS Safari and mobile video/audio streaming)
    if (rangeHeader) {
      const parts = rangeHeader.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;

      if (start >= totalSize || end >= totalSize) {
        res.writeHead(416, {
          'Content-Range': `bytes */${totalSize}`
        });
        return res.end();
      }

      const chunksize = (end - start) + 1;
      headers['Content-Range'] = `bytes ${start}-${end}/${totalSize}`;
      headers['Content-Length'] = chunksize;

      res.writeHead(206, headers);

      if (req.method === 'HEAD') {
        return res.end();
      }

      const fileStream = fs.createReadStream(filePath, { start, end });
      fileStream.pipe(res);
      fileStream.on('error', () => {
        if (!res.headersSent) res.writeHead(500);
        res.end();
      });
    } else {
      headers['Content-Length'] = totalSize;
      res.writeHead(200, headers);

      if (req.method === 'HEAD') {
        return res.end();
      }

      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
      fileStream.on('error', () => {
        if (!res.headersSent) res.writeHead(500);
        res.end();
      });
    }
  };

  if (existingStats) {
    sendResponse(existingStats);
  } else {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('File Not Found');
      }
      sendResponse(stats);
    });
  }
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🎬 PRANAYFLIX Web Service listening on port ${PORT} (http://0.0.0.0:${PORT})`);
});

