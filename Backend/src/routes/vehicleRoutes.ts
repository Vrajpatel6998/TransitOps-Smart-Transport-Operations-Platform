import { Router } from 'express';
import { getVehicles, getVehicle, createVehicle, updateVehicle, deleteVehicle } from '../controllers/vehicleController';
import { validateVehicle } from '../middlewares/validationMiddleware';
import { authenticateToken, requireRoles } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', authenticateToken, getVehicles);
router.get('/:id', authenticateToken, getVehicle);
router.post('/', authenticateToken, requireRoles(['Admin', 'FleetManager']), validateVehicle, createVehicle);
router.put('/:id', authenticateToken, requireRoles(['Admin', 'FleetManager']), validateVehicle, updateVehicle);
router.delete('/:id', authenticateToken, requireRoles(['Admin', 'FleetManager']), deleteVehicle);

export default router;
