import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { list, get, create, update, remove, play } from '../controllers/trackController.js';

const router = Router();

router.get('/tracks', list);
router.get('/tracks/:id', get);
router.post('/tracks', authenticate, requireRole('ARTIST', 'ADMIN'), create);
router.put('/tracks/:id', authenticate, requireRole('ARTIST', 'ADMIN'), update);
router.delete('/tracks/:id', authenticate, requireRole('ADMIN'), remove);
router.post('/tracks/:id/play', authenticate, play);

export default router;
