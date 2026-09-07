import { Router } from 'express';
import { create, list, remove, update } from '../controllers/resourceController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { parseBody } from '../middleware/adminValidation.js';

export const createResourceRoutes = (Model, schema, options = {}) => {
  const router = Router();
  router.get('/', asyncHandler(list(Model, options)));
  router.post('/', parseBody(schema), asyncHandler(create(Model)));
  router.put('/:id', parseBody(schema), asyncHandler(update(Model)));
  router.delete('/:id', asyncHandler(remove(Model)));
  return router;
};
