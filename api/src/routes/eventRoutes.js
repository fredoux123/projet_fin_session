import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { list, get, create, update, remove } from '../controllers/eventController.js';

const router = Router();

router.get('/events', list);
router.get('/events/:id', get);
router.post('/events', authenticate, requireRole('ARTIST', 'ADMIN'), create);
router.put('/events/:id', authenticate, requireRole('ARTIST', 'ADMIN'), update);
router.delete('/events/:id', authenticate, requireRole('ADMIN'), remove);

export default router;
