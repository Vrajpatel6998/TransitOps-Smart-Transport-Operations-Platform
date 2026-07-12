/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/database';
import { signToken, verifyToken, comparePasswords, hashPassword } from './server/auth';
import { UserRole } from './src/types';

// Extend Express Request type to include user information
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Midlewares
  app.use(express.json());

  // CORS headers middleware
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Authentication Middleware
  const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Authentication token is required' });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ error: 'Invalid or expired session token' });
    }

    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role
    };
    next();
  };

  // Role Authorization helper
  const requireRoles = (allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: `Forbidden: Only ${allowedRoles.join(', ')} can perform this action` });
      }
      next();
    };
  };

  // ==========================================
  // API Routes
  // ==========================================

  // Health check route
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ 
      status: 'ok', 
      service: 'TransitOps API', 
      timestamp: new Date().toISOString() 
    });
  });

  // POST /api/auth/login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = db.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      if (user.status !== 'Active') {
        return res.status(403).json({ error: 'Your account has been deactivated' });
      }

      const match = comparePasswords(password, user.passwordHash);
      if (!match) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = signToken({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      });

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/auth/signup (Admin only)
  app.post('/api/auth/signup', authenticateToken, requireRoles(['Admin']), (req: Request, res: Response) => {
    try {
      const { name, email, password, role, status } = req.body;
      if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'Name, email, password, and role are required' });
      }

      const existingUser = db.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'A user with this email already exists' });
      }

      const newUser = db.createUser({
        name,
        email,
        passwordHash: hashPassword(password),
        role,
        status: status || 'Active'
      });

      res.status(201).json(newUser);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/users (Admin only, user list for settings)
  app.get('/api/users', authenticateToken, requireRoles(['Admin']), (req: Request, res: Response) => {
    try {
      res.json(db.getUsers());
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- Vehicles ---
  // GET all vehicles
  app.get('/api/vehicles', (req: Request, res: Response) => {
    try {
      res.json(db.getVehicles());
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/vehicles/available
  app.get('/api/vehicles/available', (req: Request, res: Response) => {
    try {
      res.json(db.getAvailableVehicles());
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET single vehicle
  app.get('/api/vehicles/:id', (req: Request, res: Response) => {
    try {
      const vehicle = db.getVehicle(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }
      res.json(vehicle);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST create vehicle
  app.post('/api/vehicles', authenticateToken, requireRoles(['Admin', 'FleetManager']), (req: Request, res: Response) => {
    try {
      const { registrationNumber, nameModel, type, maxLoadCapacity, odometer, acquisitionCost, status, region } = req.body;
      if (!registrationNumber || !nameModel || !type || maxLoadCapacity === undefined || odometer === undefined || acquisitionCost === undefined || !status) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const vehicle = db.createVehicle({
        registrationNumber,
        nameModel,
        type,
        maxLoadCapacity: Number(maxLoadCapacity),
        odometer: Number(odometer),
        acquisitionCost: Number(acquisitionCost),
        status,
        region: region || 'Default'
      });
      res.status(201).json(vehicle);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // PUT update vehicle
  app.put('/api/vehicles/:id', authenticateToken, requireRoles(['Admin', 'FleetManager']), (req: Request, res: Response) => {
    try {
      const vehicle = db.updateVehicle(req.params.id, req.body);
      res.json(vehicle);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });


  // --- Drivers ---
  // GET all drivers
  app.get('/api/drivers', (req: Request, res: Response) => {
    try {
      res.json(db.getDrivers());
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/drivers/available
  app.get('/api/drivers/available', (req: Request, res: Response) => {
    try {
      res.json(db.getAvailableDrivers());
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET single driver
  app.get('/api/drivers/:id', (req: Request, res: Response) => {
    try {
      const driver = db.getDriver(req.params.id);
      if (!driver) {
        return res.status(404).json({ error: 'Driver not found' });
      }
      res.json(driver);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST create driver
  app.post('/api/drivers', authenticateToken, requireRoles(['Admin', 'FleetManager', 'SafetyOfficer']), (req: Request, res: Response) => {
    try {
      const { name, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber, safetyScore, status } = req.body;
      if (!name || !licenseNumber || !licenseCategory || !licenseExpiryDate || !contactNumber || safetyScore === undefined || !status) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const driver = db.createDriver({
        name,
        licenseNumber,
        licenseCategory,
        licenseExpiryDate,
        contactNumber,
        safetyScore: Number(safetyScore),
        status
      });
      res.status(201).json(driver);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // PUT update driver
  app.put('/api/drivers/:id', authenticateToken, requireRoles(['Admin', 'FleetManager', 'SafetyOfficer']), (req: Request, res: Response) => {
    try {
      const driver = db.updateDriver(req.params.id, req.body);
      res.json(driver);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });


  // --- Trips ---
  // GET all trips
  app.get('/api/trips', (req: Request, res: Response) => {
    try {
      res.json(db.getTrips());
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET single trip
  app.get('/api/trips/:id', (req: Request, res: Response) => {
    try {
      const trip = db.getTrip(req.params.id);
      if (!trip) {
        return res.status(404).json({ error: 'Trip not found' });
      }
      res.json(trip);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST create trip
  app.post('/api/trips', authenticateToken, requireRoles(['Admin', 'FleetManager']), (req: Request, res: Response) => {
    try {
      const { source, destination, vehicleId, driverId, cargoWeight, plannedDistance } = req.body;
      if (!source || !destination || !vehicleId || !driverId || cargoWeight === undefined || plannedDistance === undefined) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const trip = db.createTrip({
        source,
        destination,
        vehicleId,
        driverId,
        cargoWeight: Number(cargoWeight),
        plannedDistance: Number(plannedDistance)
      });
      res.status(201).json(trip);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // POST dispatch trip
  app.post('/api/trips/:id/dispatch', authenticateToken, requireRoles(['Admin', 'FleetManager']), (req: Request, res: Response) => {
    try {
      const trip = db.dispatchTrip(req.params.id);
      res.json({ message: 'Trip dispatched successfully', trip });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // POST complete trip
  app.post('/api/trips/:id/complete', authenticateToken, requireRoles(['Admin', 'FleetManager', 'Driver']), (req: Request, res: Response) => {
    try {
      const { finalOdometer, fuelConsumed } = req.body;
      if (finalOdometer === undefined || fuelConsumed === undefined) {
        return res.status(400).json({ error: 'finalOdometer and fuelConsumed are required' });
      }

      const trip = db.completeTrip(req.params.id, Number(finalOdometer), Number(fuelConsumed));
      res.json({ message: 'Trip completed successfully', trip });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // POST cancel trip
  app.post('/api/trips/:id/cancel', authenticateToken, requireRoles(['Admin', 'FleetManager']), (req: Request, res: Response) => {
    try {
      const trip = db.cancelTrip(req.params.id);
      res.json({ message: 'Trip cancelled successfully', trip });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });


  // --- Maintenance ---
  // GET all maintenance logs
  app.get('/api/maintenance', (req: Request, res: Response) => {
    try {
      res.json(db.getMaintenanceLogs());
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST create maintenance log
  app.post('/api/maintenance', authenticateToken, requireRoles(['Admin', 'FleetManager']), (req: Request, res: Response) => {
    try {
      const { vehicleId, description, status } = req.body;
      if (!vehicleId || !description || !status) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const log = db.createMaintenanceLog({
        vehicleId,
        description,
        status
      });
      res.status(201).json(log);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // POST close maintenance log
  app.post('/api/maintenance/:id/close', authenticateToken, requireRoles(['Admin', 'FleetManager']), (req: Request, res: Response) => {
    try {
      const log = db.closeMaintenanceLog(req.params.id);
      res.json({ message: 'Maintenance log closed successfully', log });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });


  // --- Fuel Logs ---
  // GET all fuel logs
  app.get('/api/fuel-logs', (req: Request, res: Response) => {
    try {
      res.json(db.getFuelLogs());
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST create fuel log
  app.post('/api/fuel-logs', authenticateToken, requireRoles(['Admin', 'FleetManager', 'Driver', 'FinancialAnalyst']), (req: Request, res: Response) => {
    try {
      const { vehicleId, liters, cost, date } = req.body;
      if (!vehicleId || liters === undefined || cost === undefined || !date) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const log = db.createFuelLog({
        vehicleId,
        liters: Number(liters),
        cost: Number(cost),
        date
      });
      res.status(201).json(log);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });


  // --- Expenses ---
  // GET all expenses
  app.get('/api/expenses', (req: Request, res: Response) => {
    try {
      res.json(db.getExpenses());
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST create expense
  app.post('/api/expenses', authenticateToken, requireRoles(['Admin', 'FleetManager', 'FinancialAnalyst']), (req: Request, res: Response) => {
    try {
      const { vehicleId, type, amount, date } = req.body;
      if (!vehicleId || !type || amount === undefined || !date) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const expense = db.createExpense({
        vehicleId,
        type,
        amount: Number(amount),
        date
      });
      res.status(201).json(expense);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });


  // --- Dashboard KPIs ---
  app.get('/api/dashboard/kpis', (req: Request, res: Response) => {
    try {
      res.json(db.getDashboardKPIs());
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });


  // --- Reports & Analytics ---
  app.get('/api/reports/vehicle/:id', (req: Request, res: Response) => {
    try {
      res.json(db.getVehicleReport(req.params.id));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ==========================================
  // Vite / Frontend Serve
  // ==========================================

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TransitOps server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start TransitOps fullstack server', err);
});
