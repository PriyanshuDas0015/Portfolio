import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { profileUpload } from '../middleware/uploadMiddleware.js';

const router = Router();
router.get('/', asyncHandler(getProfile));
router.put('/', profileUpload.single('profileImage'), asyncHandler(updateProfile));
export default router;
