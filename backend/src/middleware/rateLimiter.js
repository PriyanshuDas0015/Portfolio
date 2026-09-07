import { rateLimit } from 'express-rate-limit';
export const createContactLimiter = (limit = 5) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { success: false, message: 'Too many messages. Please try again in 15 minutes.' },
  });
