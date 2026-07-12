import { Router } from 'express';
import { login, signup, getProfile } from '../controllers/authController';
import { validateLogin, validateSignup } from '../middlewares/validationMiddleware';
import { authenticateToken, requireRoles } from '../middlewares/authMiddleware';

const router = Router();

router.post('/login', validateLogin, login);
router.post('/signup', authenticateToken, requireRoles(['Admin']), validateSignup, signup);
router.get('/profile', authenticateToken, getProfile);

export default router;
