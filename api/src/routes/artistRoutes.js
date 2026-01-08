import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { list, get, create, update, remove } from '../controllers/artistController.js';

const router = Router();

router.get('/artists', list);
router.get('/artists/:id', get);
router.post('/artists', authenticate, requireRole('ARTIST', 'ADMIN'), create);
router.put('/artists/:id', authenticate, requireRole('ARTIST', 'ADMIN'), update);
router.delete('/artists/:id', authenticate, requireRole('ADMIN'), remove);

export default router;
