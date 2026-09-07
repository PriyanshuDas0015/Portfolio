import bcrypt from 'bcrypt';
import { z } from 'zod';
import Admin from '../models/Admin.js';

const profileSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9._-]{3,50}$/,
      'Username must be 3–50 characters using letters, numbers, dots, underscores or hyphens.',
    ),
  name: z.string().trim().min(1).max(100),
  email: z
    .string()
    .email()
    .max(254)
    .transform((value) => value.toLowerCase()),
});
const passwordSchema = z.object({
  currentPassword: z.string().min(8).max(200),
  newPassword: z.string().min(12, 'Use at least 12 characters.').max(200),
});

export function getAccount(req, res) {
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

export async function updateAccount(req, res) {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ success: false, message: parsed.error.issues[0].message });
  const duplicate = await Admin.exists({
    _id: { $ne: req.admin._id },
    $or: [{ email: parsed.data.email }, { username: parsed.data.username }],
  });
  if (duplicate)
    return res
      .status(409)
      .json({ success: false, message: 'That username or email is already in use.' });
  Object.assign(req.admin, parsed.data);
  await req.admin.save();
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

export async function changePassword(req, res) {
  const parsed = passwordSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ success: false, message: parsed.error.issues[0].message });
  const admin = await Admin.findById(req.admin._id).select('+password +passwordHash');
  const storedPassword = admin?.password || admin?.passwordHash;
  if (!storedPassword || !(await bcrypt.compare(parsed.data.currentPassword, storedPassword)))
    return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
  admin.password = await bcrypt.hash(parsed.data.newPassword, 12);
  admin.passwordHash = undefined;
  await admin.save();
  res.json({ success: true, message: 'Password updated.' });
}
