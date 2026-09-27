import { Router } from 'express';
import { AtsController } from './ats.controller.js';
import { requireAuth } from '../auth/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.post('/scan', AtsController.scanResume);
router.get('/history', AtsController.getHistory);

export default router;
