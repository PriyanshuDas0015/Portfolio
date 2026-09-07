import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { contactRoutes } from './routes/contactRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import publicRoutes from './routes/publicRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

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
    cors({
      origin: env.origins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type'],
    }),
  );
  app.use(cookieParser());
  app.use(express.json({ limit: '16kb' }));
  app.use('/api/health', healthRoutes);
  app.use('/api/public', publicRoutes);
  app.use('/api/admin/auth', authRoutes);
  app.use('/api/admin', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/contact', contactRoutes(services, rateLimit));
  app.use((req, res) => res.status(404).json({ success: false, message: 'Endpoint not found.' }));
  app.use(errorHandler);
  return app;
}
