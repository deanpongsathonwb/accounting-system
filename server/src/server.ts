import path from 'path';
import express from 'express';
import { createApp } from './app';
import { env } from './config/env';
import { connectDatabase } from './database/connection';
import { logger } from './utils/logger';
import { createServer as createViteServer } from 'vite';

async function start() {
  try {
    await connectDatabase();
    const app = createApp();

    const PORT = Number(process.env.PORT) || env.PORT || 3000;

    // In development mode, mount Vite middleware pointing to client directory
    if (process.env.NODE_ENV !== 'production') {
      const vite = await createViteServer({
        root: path.resolve(process.cwd(), 'client'),
        configFile: path.resolve(process.cwd(), 'client/vite.config.ts'),
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      // In production mode, serve built client files from dist directory
      const distPath = path.resolve(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`Student Attendance System running at http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// If run directly
if (process.env.NODE_ENV !== 'test') {
  start();
}
