import { Router } from 'express';
import { getDrivers, getDriver, createDriver, updateDriver, deleteDriver } from '../controllers/driverController';
import { validateDriver } from '../middlewares/validationMiddleware';
import { authenticateToken, requireRoles } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', authenticateToken, getDrivers);
router.get('/:id', authenticateToken, getDriver);
router.post('/', authenticateToken, requireRoles(['Admin', 'FleetManager', 'SafetyOfficer']), validateDriver, createDriver);
router.put('/:id', authenticateToken, requireRoles(['Admin', 'FleetManager', 'SafetyOfficer']), validateDriver, updateDriver);
router.delete('/:id', authenticateToken, requireRoles(['Admin', 'FleetManager', 'SafetyOfficer']), deleteDriver);

export default router;
