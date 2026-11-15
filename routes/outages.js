import { Router } from 'express';
import * as outagesController from '../controllers/outagesController.js';
import { asyncHandler } from '../asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(outagesController.index));
router.post('/', asyncHandler(outagesController.create));
router.delete('/:id', asyncHandler(outagesController.remove));

export default router;