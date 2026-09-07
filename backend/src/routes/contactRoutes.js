import { Router } from 'express';
import { createContactController } from '../controllers/contactController.js';
import { validateContact } from '../middleware/validateContact.js';
import { createContactLimiter } from '../middleware/rateLimiter.js';
export function contactRoutes(services, limit) {
  const router = Router();
  router.post('/', createContactLimiter(limit), validateContact, createContactController(services));
  return router;
}
