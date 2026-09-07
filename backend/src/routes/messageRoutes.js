import { Router } from 'express';
import {
  archiveMessage,
  deleteMessage,
  listMessages,
  markMessage,
} from '../controllers/messageController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
const router = Router();
router.get('/', asyncHandler(listMessages));
router.put('/:id/read', asyncHandler(markMessage));
router.put('/:id/status', asyncHandler(markMessage));
router.put('/:id/archive', asyncHandler(archiveMessage));
router.delete('/:id', asyncHandler(deleteMessage));
export default router;
