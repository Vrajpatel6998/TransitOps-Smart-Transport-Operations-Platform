import { Router } from 'express';
import { getRoles, createRole } from '../controllers/roleController';
import { authenticateToken, requireRoles } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', authenticateToken, getRoles);
router.post('/', authenticateToken, requireRoles(['Admin']), createRole);

export default router;
