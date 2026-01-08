import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { list, clear } from '../controllers/historyController.js';

const router = Router();

router.get('/history', authenticate, list);
router.delete('/history', authenticate, clear);

export default router;
