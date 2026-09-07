import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { login, logout, me } from '../controllers/authController.js';
import { createContactLimiter } from '../middleware/rateLimiter.js';

const router = Router();
router.post('/login', createContactLimiter(8), asyncHandler(login));
router.post('/logout', requireAdmin, logout);
router.get('/me', requireAdmin, me);
export default router;
