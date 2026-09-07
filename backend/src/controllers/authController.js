import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import Admin from '../models/Admin.js';
import { env } from '../config/env.js';

const credentials = z
  .object({
    identifier: z.string().trim().min(1).max(254).optional(),
    email: z.string().trim().max(254).optional(),
    password: z.string().min(8).max(200),
  })
  .refine((value) => value.identifier || value.email, 'Enter your username or email.');
const cookieOptions = {
  httpOnly: true,
  secure: env.production,
  sameSite: 'strict',
  path: '/api/admin',
  maxAge: 8 * 60 * 60 * 1000,
};
export async function login(req, res) {
  if (!env.jwtSecret)
    return res
      .status(503)
      .json({ success: false, message: 'Admin authentication is not configured.' });
  if (Admin.db.readyState !== 1)
    return res.status(503).json({ success: false, message: 'Portfolio database is unavailable.' });
  const parsed = credentials.safeParse(req.body);
  if (!parsed.success)
    return res
      .status(400)
      .json({ success: false, message: 'Enter your username or email and password.' });
  const identifier = (parsed.data.identifier || parsed.data.email).toLowerCase();
  const admin = await Admin.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  }).select('+password +passwordHash');
  const storedPassword = admin?.password || admin?.passwordHash;
  if (!admin || !storedPassword || !(await bcrypt.compare(parsed.data.password, storedPassword)))
    return res
      .status(401)
      .json({ success: false, message: 'Username, email or password is incorrect.' });
  admin.lastLoginAt = new Date();
  await admin.save();
  const token = jwt.sign({ sub: admin.id }, env.jwtSecret, { algorithm: 'HS256', expiresIn: '8h' });
  res.cookie('pd_admin', token, cookieOptions);
  return res.json({
    success: true,
    admin: { id: admin.id, username: admin.username, name: admin.name, email: admin.email },
  });
}
export function logout(req, res) {
  res.clearCookie('pd_admin', cookieOptions);
  res.json({ success: true });
}
export function me(req, res) {
  res.json({
    success: true,
    admin: {
      id: req.admin.id,
      username: req.admin.username,
      name: req.admin.name,
      email: req.admin.email,
    },
  });
}
