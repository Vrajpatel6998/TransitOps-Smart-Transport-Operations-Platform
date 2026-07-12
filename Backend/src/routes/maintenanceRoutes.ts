import { Router } from 'express';
import { getMaintenanceLogs, createMaintenanceLog, updateMaintenanceLog, deleteMaintenanceLog } from '../controllers/maintenanceController';
import { validateMaintenanceLog } from '../middlewares/validationMiddleware';
import { authenticateToken, requireRoles } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', authenticateToken, getMaintenanceLogs);
router.post('/', authenticateToken, requireRoles(['Admin', 'FleetManager']), validateMaintenanceLog, createMaintenanceLog);
router.put('/:id', authenticateToken, requireRoles(['Admin', 'FleetManager']), validateMaintenanceLog, updateMaintenanceLog);
router.delete('/:id', authenticateToken, requireRoles(['Admin', 'FleetManager']), deleteMaintenanceLog);

export default router;
