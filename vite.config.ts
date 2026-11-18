import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function savesPlugin(): Plugin {
  const savesDir = path.resolve(__dirname, 'saves');
  if (!fs.existsSync(savesDir)) {
    fs.mkdirSync(savesDir, { recursive: true });
  }

  const handleMiddleware = (req: any, res: any, next: any) => {
    const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);

    // GET /api/saves -> list all save files with metadata
    if (req.method === 'GET' && !url.searchParams.get('file')) {
      try {
        const files = fs.readdirSync(savesDir).filter((f) => f.endsWith('.json'));
        const list = files.map((filename) => {
          const fullPath = path.join(savesDir, filename);
          const stats = fs.statSync(fullPath);
          let meta = null;
          try {
            const content = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
            meta = {
              name: content.name || 'Unnamed Character',
              level: content.level || 1,
              race: content.race || '',
              classes: (content.classes || []).map((c: any) => `${c.name} ${c.level}`).join(', '),
            };
          } catch (e) {}
          return {
            filename,
            size: stats.size,
            mtime: stats.mtime,
            meta,
          };
        });
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(list));
        return;
      } catch (err: any) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: err.message }));
        return;
      }
    }

    // GET /api/saves?file=filename.json -> get file content
    if (req.method === 'GET' && url.searchParams.get('file')) {
      const filename = path.basename(url.searchParams.get('file')!);
      const fullPath = path.join(savesDir, filename);
      if (!fs.existsSync(fullPath)) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'File not found' }));
        return;
      }
      try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        res.setHeader('Content-Type', 'application/json');
        res.end(content);
        return;
      } catch (err: any) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: err.message }));
        return;
      }
    }

    // POST /api/saves -> save file
    if (req.method === 'POST') {
      let body = '';
      req.on('data', (chunk: any) => {
        body += chunk;
      });
      req.on('end', () => {
        try {
          const { filename, data } = JSON.parse(body);
          const safeName = path.basename(filename || 'character.json');
          const finalName = safeName.endsWith('.json') ? safeName : `${safeName}.json`;
          const fullPath = path.join(savesDir, finalName);
          fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf-8');
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, filename: finalName }));
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message }));
        }
      });
      return;
    }

    // DELETE /api/saves?file=filename.json
    if (req.method === 'DELETE' && url.searchParams.get('file')) {
      const filename = path.basename(url.searchParams.get('file')!);
      const fullPath = path.join(savesDir, filename);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true }));
      return;
    }

    next();
  };

  return {
    name: 'saves-api',
    configureServer(server) {
      server.middlewares.use('/api/saves', handleMiddleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/saves', handleMiddleware);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/dnd-dash/' : '/',
  plugins: [
    react(),
    savesPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'apple-touch-icon.png',
        'pwa-192x192.png',
        'pwa-512x512.png',
        'maskable-icon-512x512.png',
      ],
      manifest: {
        name: 'DnD Dash - 2024 D&D Character Dashboard',
        short_name: 'DnD Dash',
        description: 'Interactive 2024 D&D 5e Character Sheet & Tactical Tabletop Dashboard',
        theme_color: '#7b1113',
        background_color: '#faf6f0',
        display: 'standalone',
        orientation: 'any',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        maximumFileSizeToCacheInBytes: 5000000,
      },
    }),
  ],
  server: {
    port: 3000,
    open: false,
  },
});
