import { Router } from 'express';
import { getExpenses, createExpense, updateExpense, deleteExpense } from '../controllers/expenseController';
import { validateExpense } from '../middlewares/validationMiddleware';
import { authenticateToken, requireRoles } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', authenticateToken, getExpenses);
router.post('/', authenticateToken, requireRoles(['Admin', 'FleetManager', 'FinancialAnalyst']), validateExpense, createExpense);
router.put('/:id', authenticateToken, requireRoles(['Admin', 'FleetManager', 'FinancialAnalyst']), validateExpense, updateExpense);
router.delete('/:id', authenticateToken, requireRoles(['Admin', 'FleetManager', 'FinancialAnalyst']), deleteExpense);

export default router;
