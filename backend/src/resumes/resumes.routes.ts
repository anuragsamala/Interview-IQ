import { Router } from 'express';
import { ResumesController } from './resumes.controller.js';
import { requireAuth } from '../auth/auth.middleware.js';
import { upload } from '../config/multer.js';

const router = Router();

// All resume routes require authentication
router.use(requireAuth);

router.post('/upload', upload.single('resume'), ResumesController.uploadResume);
router.get('/', ResumesController.getResumes);
router.delete('/:id', ResumesController.deleteResume);

export default router;
