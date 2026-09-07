import { Router } from 'express';
import Project from '../models/Project.js';
import { list } from '../controllers/resourceController.js';
import {
  createProject,
  deleteProject,
  deleteProjectGalleryImage,
  updateProject,
} from '../controllers/projectController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { projectUpload } from '../middleware/uploadMiddleware.js';
import { projectSchema } from '../validation/schemas.js';

const router = Router();
const uploads = projectUpload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'logo', maxCount: 1 },
  { name: 'gallery', maxCount: 8 },
  { name: 'demoVideo', maxCount: 1 },
]);
router.get('/', asyncHandler(list(Project)));
router.post(
  '/',
  uploads,
  (req, res, next) => {
    req.projectSchema = projectSchema;
    next();
  },
  asyncHandler(createProject),
);
router.put(
  '/:id',
  uploads,
  (req, res, next) => {
    req.projectSchema = projectSchema;
    next();
  },
  asyncHandler(updateProject),
);
router.delete('/:id', asyncHandler(deleteProject));
router.delete('/:id/gallery/:assetId', asyncHandler(deleteProjectGalleryImage));
export default router;
