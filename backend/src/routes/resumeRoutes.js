import { Router } from 'express';
import {
  activateResume,
  deleteResume,
  getResume,
  uploadResume,
} from '../controllers/resumeController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { resumeUpload } from '../middleware/uploadMiddleware.js';

const router = Router();
router.get('/', asyncHandler(getResume));
router.post('/', resumeUpload.single('resume'), asyncHandler(uploadResume));
router.put('/:id/activate', asyncHandler(activateResume));
router.delete('/:id', asyncHandler(deleteResume));
export default router;
