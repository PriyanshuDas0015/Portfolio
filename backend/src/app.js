import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env.js';
import { contactRoutes } from './routes/contactRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp({ services, rateLimit } = {}) {
  const app = express();
  app.disable('x-powered-by');
  if (env.trustProxyHops > 0) app.set('trust proxy', env.trustProxyHops);
  app.use(helmet());
  app.use((req, res, next) => {
    const origin = req.get('origin');
    if (origin && !env.origins.includes(origin))
      return res.status(403).json({ success: false, message: 'This origin is not allowed.' });
    next();
  });
  app.use(
    cors({ origin: env.origins, methods: ['GET', 'POST'], allowedHeaders: ['Content-Type'] }),
  );
  app.use(express.json({ limit: '16kb' }));
  app.use('/api/health', healthRoutes);
  app.use('/api/contact', contactRoutes(services, rateLimit));
  app.use((req, res) => res.status(404).json({ success: false, message: 'Endpoint not found.' }));
  app.use(errorHandler);
  return app;
}
