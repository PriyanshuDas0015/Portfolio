import { Router } from 'express';
import {
  createEducation,
  deleteEducation,
  listEducation,
  updateEducation,
} from '../controllers/educationController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { adminSchemas } from '../middleware/adminValidation.js';
import { educationUpload } from '../middleware/uploadMiddleware.js';
const router = Router();
router.use((req, res, next) => {
  req.educationSchema = adminSchemas.education;
  next();
});
router.get('/', asyncHandler(listEducation));
router.post('/', educationUpload.single('logo'), asyncHandler(createEducation));
router.put('/:id', educationUpload.single('logo'), asyncHandler(updateEducation));
router.delete('/:id', asyncHandler(deleteEducation));
export default router;
