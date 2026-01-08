import { Router } from 'express';
import { ping } from '../controllers/adminController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/ping', authenticate, requireRole('ADMIN'), ping);

export default router;
