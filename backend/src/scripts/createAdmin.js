import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { connectDatabase } from '../config/database.js';
import { env } from '../config/env.js';
import Admin from '../models/Admin.js';

const askPassword = (label) =>
  new Promise((resolve, reject) => {
    if (!input.isTTY || !input.setRawMode)
      return reject(new Error('Run create-admin in an interactive terminal.'));
    let value = '';
    output.write(label);
    input.setEncoding('utf8');
    input.setRawMode(true);
    input.resume();
    const finish = (error) => {
      input.off('data', onData);
      input.setRawMode(false);
      input.pause();
      output.write('\n');
      if (error) reject(error);
      else resolve(value);
    };
    const onData = (key) => {
      if (key === '\u0003') return finish(new Error('Admin creation cancelled.'));
      if (key === '\r' || key === '\n') return finish();
      if (key === '\u007f' || key === '\b') {
        if (value) {
          value = value.slice(0, -1);
          output.write('\b \b');
        }
        return;
      }
      if (key >= ' ') {
        value += key;
        output.write('*');
      }
    };
    input.on('data', onData);
  });

if (!env.mongoUri) throw new Error('Set MONGODB_URI in backend/.env before running create-admin.');
const prompt = createInterface({ input, output });
const username = (await prompt.question('Username: ')).trim().toLowerCase();
const email = (await prompt.question('Email: ')).trim().toLowerCase();
prompt.close();
const password = await askPassword('Password: ');
if (!/^[a-z0-9._-]{3,50}$/.test(username))
  throw new Error(
    'Username must be 3–50 characters using letters, numbers, dots, underscores or hyphens.',
  );
if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Enter a valid email address.');
if (password.length < 12) throw new Error('Password must contain at least 12 characters.');

try {
  await connectDatabase();
  const conflict = await Admin.findOne({ username, email: { $ne: email } });
  if (conflict) throw new Error('That username already belongs to another admin email.');
  const passwordHash = await bcrypt.hash(password, 12);
  await Admin.findOneAndUpdate(
    { email },
    { username, name: username, email, passwordHash },
    { upsert: true, runValidators: true },
  );
  console.info(`Admin account ready for ${username}.`);
} finally {
  await mongoose.disconnect();
}
