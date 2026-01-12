import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { list } from '../controllers/recommendationController.js';

const router = Router();

router.get('/recommendations', authenticate, list);

export default router;
