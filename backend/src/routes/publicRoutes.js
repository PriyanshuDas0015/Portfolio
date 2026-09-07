import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import {
  publicEducation,
  downloadResume,
  publicProjects,
  publicResume,
  publicServices,
  publicSite,
  publicSkills,
  publicTimeline,
  publicCertificates,
} from '../controllers/publicController.js';

const router = Router();
router.get('/site', asyncHandler(publicSite));
router.get('/projects', asyncHandler(publicProjects));
router.get('/skills', asyncHandler(publicSkills));
router.get('/timeline', asyncHandler(publicTimeline));
router.get('/education', asyncHandler(publicEducation));
router.get('/services', asyncHandler(publicServices));
router.get('/certificates', asyncHandler(publicCertificates));
router.get('/resume', asyncHandler(publicResume));
router.get('/resume/download', asyncHandler(downloadResume));
export default router;
