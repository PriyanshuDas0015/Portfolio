import bcrypt from 'bcrypt';
import { connectDatabase } from '../config/database.js';
import { env } from '../config/env.js';
import Admin from '../models/Admin.js';

if (!env.mongoUri || !env.adminEmail || !env.adminPassword)
  throw new Error('Set MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD before creating the admin.');
if (env.adminPassword.length < 12)
  throw new Error('ADMIN_PASSWORD must contain at least 12 characters.');
await connectDatabase();
const password = await bcrypt.hash(env.adminPassword, 12);
const username = (env.adminUsername || env.adminEmail.split('@')[0]).toLowerCase();
await Admin.findOneAndUpdate(
  { email: env.adminEmail.toLowerCase() },
  { username, name: username, email: env.adminEmail.toLowerCase(), password },
  { upsert: true, runValidators: true },
);
console.info(`Admin account ready for ${username} (${env.adminEmail}).`);
process.exit(0);
