import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
dotenv.config({ path: fileURLToPath(new URL('../../.env', import.meta.url)), quiet: true });
export const env = {
  port: Number(process.env.PORT || 3001),
  origins: (process.env.FRONTEND_URL || 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',')
    .map((value) => value.trim()),
  mongoUri: process.env.MONGODB_URI || '',
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  smtpFrom: process.env.SMTP_FROM || process.env.SMTP_USER || '',
  receiver: process.env.CONTACT_RECEIVER_EMAIL || '',
  trustProxyHops: Number(process.env.TRUST_PROXY_HOPS || 0),
};
