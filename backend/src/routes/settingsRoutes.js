import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { parseBody } from '../middleware/adminValidation.js';
const router = Router();
router.get('/', asyncHandler(getSettings));
router.put('/', parseBody('settings'), asyncHandler(updateSettings));
export default router;
