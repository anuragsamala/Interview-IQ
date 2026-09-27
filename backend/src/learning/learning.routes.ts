import { Router } from 'express';
import { LearningController } from './learning.controller.js';
import { requireAuth } from '../auth/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/roadmap', LearningController.getRoadmap);
router.post('/roadmap', LearningController.getRoadmap);

export default router;
