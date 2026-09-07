import { Router } from 'express';
import { changePassword, getAccount, updateAccount } from '../controllers/accountController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();
router.get('/', getAccount);
router.put('/', asyncHandler(updateAccount));
router.put('/password', asyncHandler(changePassword));
export default router;
