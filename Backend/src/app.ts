import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import roleRoutes from './routes/roleRoutes';
import userRoutes from './routes/userRoutes';
import vehicleRoutes from './routes/vehicleRoutes';
import driverRoutes from './routes/driverRoutes';
import maintenanceRoutes from './routes/maintenanceRoutes';
import fuelLogRoutes from './routes/fuelLogRoutes';
import expenseRoutes from './routes/expenseRoutes';
import { authenticateToken } from './middlewares/authMiddleware';
import { getDashboardKPIs } from './controllers/vehicleController';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/fuel-logs', fuelLogRoutes);
app.use('/api/expenses', expenseRoutes);

// Dashboard
app.get('/api/dashboard/kpis', authenticateToken, getDashboardKPIs);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
