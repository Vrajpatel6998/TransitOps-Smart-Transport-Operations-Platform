import { Router } from 'express';
import { getUsers, updateUser } from '../controllers/userController';
import { authenticateToken, requireRoles } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', authenticateToken, requireRoles(['Admin']), getUsers);
router.put('/:id', authenticateToken, requireRoles(['Admin']), updateUser);

export default router;
