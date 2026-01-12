import { Router } from 'express';
import { ping } from '../controllers/adminController.js';
import { approve, reject } from '../controllers/adminEventController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/ping', authenticate, requireRole('ADMIN'), ping);
router.patch('/events/:id/approve', authenticate, requireRole('ADMIN'), approve);
router.patch('/events/:id/reject', authenticate, requireRole('ADMIN'), reject);

export default router;
