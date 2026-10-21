import { Router } from 'express';
import * as addressesController from '../controllers/addressesController.js';
import { asyncHandler } from '../asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(addressesController.index));
router.post('/', asyncHandler(addressesController.create));

export default router;
