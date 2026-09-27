import { Router } from 'express';
import { AdminController } from './admin.controller.js';
import { requireAuth } from '../auth/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/overview', AdminController.getOverview);

export default router;
