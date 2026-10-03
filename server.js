/**
 * TIPPED Portal — Server & API Gateway
 * File: server.js
 * 
 * Features:
 * - Clean route resolution & SPA routing
 * - Standardized API error handling middleware (errorHandler)
 * - Catch-all 404 & /not-found handling
 * - Hybrid Express & native Node HTTP server compatibility
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { errorHandler, AppError } = require('./middleware/errorHandler');

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
  '/report/new': '/report/new.html',
  '/not-found': '/404.html',
  '/404': '/404.html'
};

// Express App Initialization (when Express is used in project)
let expressApp = null;
try {
  const express = require('express');
  expressApp = express();
  expressApp.use(express.json());
  expressApp.use(express.urlencoded({ extended: true }));

  // Static Assets
  expressApp.use(express.static(ROOT));

  // Mount API Routes
  try {
    const apiRoutes = require('./routes/apiRoutes');
    expressApp.use('/api', apiRoutes);
  } catch (rErr) {
    console.warn('API routes mount note:', rErr.message);
  }

  // HTML Route Handlers
  Object.keys(ROUTES).forEach((routePath) => {
    expressApp.get(routePath, (req, res) => {
      res.sendFile(path.join(ROOT, ROUTES[routePath]));
    });
  });

  // Catch-all 404 for unhandled API and Web Routes
  expressApp.all('/api/*', (req, res, next) => {
    next(new AppError(`Cannot ${req.method} ${req.originalUrl} - Endpoint not found`, 404));
  });

  expressApp.get('*', (req, res) => {
    res.status(404).sendFile(path.join(ROOT, '404.html'));
  });

  // ATTACH GLOBAL ERROR HANDLER AT THE END OF APP
  expressApp.use(errorHandler);
} catch (e) {
  // Fallback to native HTTP server if express module is not installed
}

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

  // Check file existence -> Fallback to 404
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    if (reqUrl.startsWith('/api/')) {
      // Standardized JSON error for API requests
      res.writeHead(404, { 'Content-Type': 'application/json; charset=UTF-8' });
      res.end(JSON.stringify({
        success: false,
        status: 404,
        message: `Endpoint ${reqUrl} not found on this server.`
      }));
      return;
    }

    const notFoundPage = path.join(ROOT, '404.html');
    if (fs.existsSync(notFoundPage)) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
      fs.createReadStream(notFoundPage).pipe(res);
    } else {
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
    }
    return;
  }

  // Serve static file
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=UTF-8' });
      res.end(JSON.stringify({
        success: false,
        status: 500,
        message: `Internal Server Error: ${err.message}`
      }));
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
  console.log(`    - 404 Catch-all: http://localhost:${PORT}/not-found`);
  console.log(`==================================================\n`);
});

module.exports = { server, expressApp };
