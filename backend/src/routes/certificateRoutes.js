import { Router } from 'express';
import {
  createCertificate,
  deleteCertificate,
  listCertificates,
  updateCertificate,
} from '../controllers/certificateController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { adminSchemas } from '../middleware/adminValidation.js';
import { certificateUpload } from '../middleware/uploadMiddleware.js';

const router = Router();
const upload = certificateUpload.fields([
  { name: 'certificateImage', maxCount: 1 },
  { name: 'certificatePdf', maxCount: 1 },
]);
router.use((req, res, next) => {
  req.certificateSchema = adminSchemas.certificate;
  next();
});
router.get('/', asyncHandler(listCertificates));
router.post('/', upload, asyncHandler(createCertificate));
router.put('/:id', upload, asyncHandler(updateCertificate));
router.delete('/:id', asyncHandler(deleteCertificate));
export default router;
