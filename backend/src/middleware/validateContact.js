import { z } from 'zod';
import { sanitize } from '../utils/sanitize.js';
const text = z.string().transform(sanitize);
const schema = z.object({
  name: text
    .pipe(
      z
        .string()
        .min(2, 'Please enter at least 2 characters.')
        .max(80, 'Please use 80 characters or fewer.'),
    )
    .refine((value) => !/[\r\n]/.test(value), 'Please enter a single-line name.'),
  email: z.string().trim().max(254).email('Please enter a valid email address.'),
  message: text.pipe(
    z
      .string()
      .min(10, 'Please write at least 10 characters.')
      .max(5000, 'Please use 5,000 characters or fewer.'),
  ),
});
export function validateContact(req, res, next) {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = {};
    for (const issue of result.error.issues) errors[issue.path[0] || 'form'] ??= issue.message;
    return res
      .status(400)
      .json({ success: false, message: 'Please check the highlighted fields.', errors });
  }
  req.contact = result.data;
  next();
}
