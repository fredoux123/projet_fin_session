import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { add, list, remove } from '../controllers/favoriteController.js';

const router = Router();

router.post('/favorites/artists/:artistId', authenticate, add);
router.get('/favorites/artists', authenticate, list);
router.delete('/favorites/artists/:artistId', authenticate, remove);

export default router;
