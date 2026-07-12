import { Router } from 'express';
import { getFuelLogs, createFuelLog, updateFuelLog, deleteFuelLog } from '../controllers/fuelLogController';
import { validateFuelLog } from '../middlewares/validationMiddleware';
import { authenticateToken, requireRoles } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', authenticateToken, getFuelLogs);
router.post('/', authenticateToken, requireRoles(['Admin', 'FleetManager', 'Driver', 'FinancialAnalyst']), validateFuelLog, createFuelLog);
router.put('/:id', authenticateToken, requireRoles(['Admin', 'FleetManager', 'Driver', 'FinancialAnalyst']), validateFuelLog, updateFuelLog);
router.delete('/:id', authenticateToken, requireRoles(['Admin', 'FleetManager', 'Driver', 'FinancialAnalyst']), deleteFuelLog);

export default router;
