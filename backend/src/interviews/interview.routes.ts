import { Router } from 'express';
import { InterviewController } from './interview.controller.js';
import { requireAuth } from '../auth/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.post('/start', InterviewController.start);
router.post('/speechx/evaluate', InterviewController.evaluateSpeechX);
router.post('/:id/answer', InterviewController.answer);
router.post('/:id/complete', InterviewController.complete);
router.get('/', InterviewController.getHistory);
router.get('/:id', InterviewController.getInterview);

export default router;
