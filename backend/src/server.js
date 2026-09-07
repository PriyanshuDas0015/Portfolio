import mongoose from 'mongoose';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';

try {
  await connectDatabase();
} catch {
  console.error('Database connection failed. Contact delivery requires working MongoDB or SMTP.');
}
const server = createApp().listen(env.port, () =>
  console.info(`Portfolio API running on port ${env.port}`),
);
const shutdown = () => {
  server.close(async () => {
    await mongoose.disconnect();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
