import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { connectDatabase } from '../src/config/database.js';
import { env } from '../src/config/env.js';
import Admin from '../src/models/Admin.js';

function askHiddenPassword(label) {
  return new Promise((resolve, reject) => {
    if (!input.isTTY || typeof input.setRawMode !== 'function') {
      reject(new Error('Run this command in an interactive terminal.'));
      return;
    }

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
}

async function createAdmin() {
  if (!env.mongoUri) throw new Error('Set MONGODB_URI in backend/.env before continuing.');

  await connectDatabase();
  const prompt = createInterface({ input, output });
  const username = (await prompt.question('Username: ')).trim().toLowerCase();
  const email = (await prompt.question('Email: ')).trim().toLowerCase();
  prompt.close();
  const plainPassword = await askHiddenPassword('Password: ');

  if (!/^[a-z0-9._-]{3,50}$/.test(username))
    throw new Error(
      'Username must be 3–50 characters using letters, numbers, dots, underscores or hyphens.',
    );
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Enter a valid email address.');
  if (plainPassword.length < 12) throw new Error('Password must contain at least 12 characters.');

  const duplicate = await Admin.findOne({ $or: [{ username }, { email }] }).lean();
  if (duplicate) {
    const field = duplicate.username === username ? 'username' : 'email';
    throw new Error(`An admin with that ${field} already exists.`);
  }

  const password = await bcrypt.hash(plainPassword, 12);
  await Admin.create({ username, email, password, name: username });
  console.info(`Admin account created successfully for ${username}.`);
}

try {
  await createAdmin();
} catch (error) {
  console.error(`Admin creation failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
