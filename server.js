/**
 * TIPPED Portal — Local Development Server
 * File: server.js
 * 
 * Zero-dependency Node.js HTTP server.
 * Run with: node server.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const ROUTES = {
  '/': '/login.html',
  '/login': '/login.html',
  '/register': '/login.html',
  '/dashboard': '/dashboard.html',
  '/admin': '/admin.html',
  '/my-reports': '/my-reports.html',
  '/report/new': '/report/new.html'
};

const server = http.createServer((req, res) => {
  // Parse clean URL
  let reqUrl = req.url.split('?')[0].split('#')[0];

  // Route aliases
  if (ROUTES[reqUrl]) {
    reqUrl = ROUTES[reqUrl];
  }

  // Safe file path resolution
  let filePath = path.join(ROOT, reqUrl);

  // Directory handling
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    const indexPath = path.join(filePath, 'index.html');
    if (fs.existsSync(indexPath)) {
      filePath = indexPath;
    }
  }

  // Fallback with .html if file doesn't exist
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  }

  // Check file existence
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>404 — Page Not Found | TIPPED</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body class="dashboard-body" style="display:flex; align-items:center; justify-content:center; min-height:100vh; text-align:center;">
        <div>
          <h1 style="font-size:3rem; color:var(--color-gold); margin-bottom:1rem;">404</h1>
          <p style="font-size:1.1rem; color:var(--color-text-secondary); margin-bottom:2rem;">The requested page could not be found.</p>
          <a href="/dashboard" class="dash-banner__cta" style="display:inline-flex;">Return to Dashboard</a>
        </div>
      </body>
      </html>
    `);
    return;
  }

  // Serve static file
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end(`500 Internal Server Error: ${err.message}`);
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`  TIPPED Portal Server is running!`);
  console.log(`  URL: http://localhost:${PORT}`);
  console.log(`  Routes available:`);
  console.log(`    - Login / Auth:  http://localhost:${PORT}/login`);
  console.log(`    - Dashboard:     http://localhost:${PORT}/dashboard`);
  console.log(`    - Admin Console: http://localhost:${PORT}/admin`);
  console.log(`    - My Reports:    http://localhost:${PORT}/my-reports`);
  console.log(`    - Submit Report: http://localhost:${PORT}/report/new`);
  console.log(`==================================================\n`);
});
