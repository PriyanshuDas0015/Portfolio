import { Router } from 'express';
import { deleteMedia, listMedia, uploadMedia } from '../controllers/mediaController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { mediaUpload } from '../middleware/uploadMiddleware.js';

const router = Router();
router.get('/', asyncHandler(listMedia));
router.post('/', mediaUpload.single('media'), asyncHandler(uploadMedia));
router.delete('/:id', asyncHandler(deleteMedia));
export default router;
