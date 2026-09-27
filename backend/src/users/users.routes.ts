import { Router } from 'express';
import { UsersController } from './users.controller.js';
import { requireAuth } from '../auth/auth.middleware.js';

const router = Router();

// All user routes require authentication
router.use(requireAuth);

router.get('/profile', UsersController.getProfile);
router.put('/profile', UsersController.updateProfile);
router.get('/resumes', UsersController.getResumes);

export default router;
