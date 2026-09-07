import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { env } from '../config/env.js';

export async function requireAdmin(req, res, next) {
  const token = req.cookies?.pd_admin;
  if (!token || !env.jwtSecret)
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  try {
    const payload = jwt.verify(token, env.jwtSecret, { algorithms: ['HS256'] });
    const admin = await Admin.findById(payload.sub).select('username name email');
    if (!admin) throw new Error('Admin not found');
    req.admin = admin;
    next();
  } catch {
    res.clearCookie('pd_admin', { path: '/api/admin' });
    return res.status(401).json({ success: false, message: 'Your session has expired.' });
  }
}
