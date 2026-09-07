import mongoose from 'mongoose';
import { env } from './env.js';
export async function connectDatabase() {
  if (!env.mongoUri) return;
  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 5000 });
  console.info('Contact message database connected.');
}
