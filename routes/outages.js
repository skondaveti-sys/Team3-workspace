import { Router } from 'express';
import * as outagesController from '../controllers/outagesController.js';
import { asyncHandler } from '../asyncHandler.js';
import { requireLogin } from '../middleware/requireLogin.js';

const router = Router();

router.get('/', asyncHandler(outagesController.index));
router.post('/', requireLogin, asyncHandler(outagesController.create));
router.delete('/:id', requireLogin, asyncHandler(outagesController.remove));

export default router;
