import { Router } from 'express';
import { CodingController } from './coding.controller.js';
import { requireAuth } from '../auth/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/problems', CodingController.getProblems);
router.post('/submit', CodingController.submit);
router.get('/history', CodingController.getHistory);

export default router;
