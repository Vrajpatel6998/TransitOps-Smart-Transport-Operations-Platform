/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import { 
  User, UserRole, Vehicle, Driver, Trip, MaintenanceLog, FuelLog, Expense, 
  DashboardKPIs, VehicleReport 
} from '../src/types';

const DATA_FILE = path.join(process.cwd(), 'server-data.json');

interface DatabaseSchema {
  users: (User & { passwordHash: string })[];
  vehicles: Vehicle[];
  drivers: Driver[];
  trips: Trip[];
  maintenanceLogs: MaintenanceLog[];
  fuelLogs: FuelLog[];
  expenses: Expense[];
}

// Initial high-fidelity seed data
const initialData: DatabaseSchema = {
  users: [
    {
      id: 'usr-1',
      name: 'Nishant Admin',
      email: 'admin@transitops.com',
      passwordHash: '$2b$10$abcdefghijklmnopqrstu.hashedadminpwd123', // Admin password 'admin123'
      role: 'Admin',
      status: 'Active'
    },
    {
      id: 'usr-2',
      name: 'Marcus Fleet',
      email: 'manager@transitops.com',
      passwordHash: '$2b$10$abcdefghijklmnopqrstu.hashedmanagerpwd123', // Manager password 'manager123'
      role: 'FleetManager',
      status: 'Active'
    },
    {
      id: 'usr-3',
      name: 'Alex Driver',
      email: 'driver@transitops.com',
      passwordHash: '$2b$10$abcdefghijklmnopqrstu.hasheddriverpwd123', // Driver password 'driver123'
      role: 'Driver',
      status: 'Active'
    },
    {
      id: 'usr-4',
      name: 'Sarah Safety',
      email: 'safety@transitops.com',
      passwordHash: '$2b$10$abcdefghijklmnopqrstu.hashedsafetypwd123', // Safety Officer password 'safety123'
      role: 'SafetyOfficer',
      status: 'Active'
    },
    {
      id: 'usr-5',
      name: 'Fiona Finance',
      email: 'finance@transitops.com',
      passwordHash: '$2b$10$abcdefghijklmnopqrstu.hashedfinancepwd123', // Financial Analyst password 'finance123'
      role: 'FinancialAnalyst',
      status: 'Active'
    }
  ],
  vehicles: [
    {
      id: 'veh-1',
      registrationNumber: 'CA-992-FL',
      nameModel: 'Freightliner M2 106',
      type: 'Heavy Truck',
      maxLoadCapacity: 12000,
      odometer: 145200,
      acquisitionCost: 85000,
      status: 'Available',
      region: 'West Coast'
    },
    {
      id: 'veh-2',
      registrationNumber: 'TX-817-TX',
      nameModel: 'Ford F-550 Super Duty',
      type: 'Flatbed',
      maxLoadCapacity: 8000,
      odometer: 82400,
      acquisitionCost: 62000,
      status: 'OnTrip',
      region: 'South Region'
    },
    {
      id: 'veh-3',
      registrationNumber: 'NY-334-OP',
      nameModel: 'Mercedes-Benz Sprinter 3500',
      type: 'Cargo Van',
      maxLoadCapacity: 3500,
      odometer: 42100,
      acquisitionCost: 48000,
      status: 'InShop',
      region: 'East Coast'
    },
    {
      id: 'veh-4',
      registrationNumber: 'FL-205-TR',
      nameModel: 'Volvo VNL 860',
      type: 'Semi-Truck',
      maxLoadCapacity: 24000,
      odometer: 289000,
      acquisitionCost: 140000,
      status: 'Retired',
      region: 'East Coast'
    },
    {
      id: 'veh-5',
      registrationNumber: 'Van-05',
      nameModel: 'Ford Transit 250',
      type: 'Light Van',
      maxLoadCapacity: 1500,
      odometer: 12000,
      acquisitionCost: 35000,
      status: 'Available',
      region: 'Midwest'
    }
  ],
  drivers: [
    {
      id: 'drv-1',
      name: 'Alex Rivera',
      licenseNumber: 'DL-9948271',
      licenseCategory: 'Class A CDL',
      licenseExpiryDate: '2028-11-15',
      contactNumber: '+1 (555) 019-2831',
      safetyScore: 94,
      status: 'Available'
    },
    {
      id: 'drv-2',
      name: 'Marcus Vance',
      licenseNumber: 'DL-4819283',
      licenseCategory: 'Class B CDL',
      licenseExpiryDate: '2027-04-20',
      contactNumber: '+1 (555) 014-9982',
      safetyScore: 88,
      status: 'OnTrip'
    },
    {
      id: 'drv-3',
      name: 'Sarah Jenkins',
      licenseNumber: 'DL-1092834',
      licenseCategory: 'Standard Class C',
      licenseExpiryDate: '2026-09-12',
      contactNumber: '+1 (555) 012-3849',
      safetyScore: 99,
      status: 'Available'
    },
    {
      id: 'drv-4',
      name: 'Dave Miller',
      licenseNumber: 'DL-8827391',
      licenseCategory: 'Class A CDL',
      licenseExpiryDate: '2023-01-10', // Expired!
      contactNumber: '+1 (555) 018-4923',
      safetyScore: 72,
      status: 'OffDuty'
    },
    {
      id: 'drv-5',
      name: 'Robert Taylor',
      licenseNumber: 'DL-5527182',
      licenseCategory: 'Class A CDL',
      licenseExpiryDate: '2027-06-30',
      contactNumber: '+1 (555) 015-8827',
      safetyScore: 64,
      status: 'Suspended'
    }
  ],
  trips: [
    {
      id: 'trp-1',
      source: 'Warehouse Alpha, Seattle',
      destination: 'Distribution Center, Los Angeles',
      vehicleId: 'veh-1',
      driverId: 'drv-1',
      cargoWeight: 10500,
      plannedDistance: 1140,
      status: 'Completed',
      finalOdometer: 146340,
      fuelConsumed: 380,
      createdAt: '2026-07-01T10:00:00.000Z'
    },
    {
      id: 'trp-2',
      source: 'Houston Port Terminal',
      destination: 'Logistics Hub, Dallas',
      vehicleId: 'veh-2',
      driverId: 'drv-2',
      cargoWeight: 7200,
      plannedDistance: 240,
      status: 'Dispatched',
      createdAt: '2026-07-10T14:30:00.000Z'
    },
    {
      id: 'trp-3',
      source: 'Chicago Depot',
      destination: 'Retail Center, Indianapolis',
      vehicleId: 'veh-5',
      driverId: 'drv-3',
      cargoWeight: 1200,
      plannedDistance: 180,
      status: 'Draft',
      createdAt: '2026-07-11T09:15:00.000Z'
    }
  ],
  maintenanceLogs: [
    {
      id: 'mnt-1',
      vehicleId: 'veh-3',
      description: 'Brake pad replacement and transmission fluid flush.',
      status: 'Active',
      createdDate: '2026-07-09T08:00:00.000Z'
    },
    {
      id: 'mnt-2',
      vehicleId: 'veh-1',
      description: 'Standard engine oil change and 24-point safety check.',
      status: 'Closed',
      createdDate: '2026-06-15T09:00:00.000Z',
      closedDate: '2026-06-15T14:30:00.000Z'
    }
  ],
  fuelLogs: [
    {
      id: 'fuel-1',
      vehicleId: 'veh-1',
      liters: 380,
      cost: 650,
      date: '2026-07-03'
    },
    {
      id: 'fuel-2',
      vehicleId: 'veh-2',
      liters: 85,
      cost: 148,
      date: '2026-07-10'
    }
  ],
  expenses: [
    {
      id: 'exp-1',
      vehicleId: 'veh-1',
      type: 'Toll',
      amount: 45,
      date: '2026-07-02'
    },
    {
      id: 'exp-2',
      vehicleId: 'veh-3',
      type: 'Maintenance Cost',
      amount: 450,
      date: '2026-07-09'
    }
  ]
};

// Database wrapper
class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = initialData;
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
      } else {
        this.save();
      }
    } catch (e) {
      console.error('Error loading database, using memory-only store', e);
    }
  }

  private save() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving database', e);
    }
  }

  // --- Users ---
  getUsers() {
    return this.data.users.map(({ passwordHash, ...user }) => user);
  }

  getUserByEmail(email: string) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(user: Omit<User, 'id'> & { passwordHash: string }) {
    const id = 'usr-' + (this.data.users.length + 1);
    const newUser = { id, ...user };
    this.data.users.push(newUser);
    this.save();
    const { passwordHash, ...safeUser } = newUser;
    return safeUser;
  }

  // --- Vehicles ---
  getVehicles() {
    this.load(); // Refresh state
    return this.data.vehicles;
  }

  getVehicle(id: string) {
    this.load();
    return this.data.vehicles.find(v => v.id === id);
  }

  createVehicle(vehicle: Omit<Vehicle, 'id'>) {
    this.load();
    const exists = this.data.vehicles.some(v => v.registrationNumber.toLowerCase() === vehicle.registrationNumber.toLowerCase());
    if (exists) {
      throw new Error(`Vehicle registration number ${vehicle.registrationNumber} already exists`);
    }
    const id = 'veh-' + (this.data.vehicles.length + 1);
    const newVehicle = { id, ...vehicle };
    this.data.vehicles.push(newVehicle);
    this.save();
    return newVehicle;
  }

  updateVehicle(id: string, updates: Partial<Vehicle>) {
    this.load();
    const idx = this.data.vehicles.findIndex(v => v.id === id);
    if (idx === -1) throw new Error(`Vehicle ${id} not found`);

    if (updates.registrationNumber) {
      const exists = this.data.vehicles.some(
        v => v.id !== id && v.registrationNumber.toLowerCase() === updates.registrationNumber!.toLowerCase()
      );
      if (exists) {
        throw new Error(`Vehicle registration number ${updates.registrationNumber} already exists`);
      }
    }

    this.data.vehicles[idx] = { ...this.data.vehicles[idx], ...updates };
    this.save();
    return this.data.vehicles[idx];
  }

  getAvailableVehicles() {
    this.load();
    return this.data.vehicles.filter(v => v.status === 'Available');
  }

  // --- Drivers ---
  getDrivers() {
    this.load();
    return this.data.drivers;
  }

  getDriver(id: string) {
    this.load();
    return this.data.drivers.find(d => d.id === id);
  }

  createDriver(driver: Omit<Driver, 'id'>) {
    this.load();
    const id = 'drv-' + (this.data.drivers.length + 1);
    const newDriver = { id, ...driver };
    this.data.drivers.push(newDriver);
    this.save();
    return newDriver;
  }

  updateDriver(id: string, updates: Partial<Driver>) {
    this.load();
    const idx = this.data.drivers.findIndex(d => d.id === id);
    if (idx === -1) throw new Error(`Driver ${id} not found`);
    this.data.drivers[idx] = { ...this.data.drivers[idx], ...updates };
    this.save();
    return this.data.drivers[idx];
  }

  getAvailableDrivers() {
    this.load();
    const today = new Date().toISOString().split('T')[0];
    return this.data.drivers.filter(d => 
      d.status === 'Available' && 
      d.licenseExpiryDate > today
    );
  }

  // --- Trips ---
  getTrips() {
    this.load();
    return this.data.trips.map(t => ({
      ...t,
      vehicle: this.data.vehicles.find(v => v.id === t.vehicleId),
      driver: this.data.drivers.find(d => d.id === t.driverId)
    }));
  }

  getTrip(id: string) {
    this.load();
    const trip = this.data.trips.find(t => t.id === id);
    if (!trip) return undefined;
    return {
      ...trip,
      vehicle: this.data.vehicles.find(v => v.id === trip.vehicleId),
      driver: this.data.drivers.find(d => d.id === trip.driverId)
    };
  }

  createTrip(trip: Omit<Trip, 'id' | 'status' | 'createdAt'>) {
    this.load();
    const vehicle = this.getVehicle(trip.vehicleId);
    if (!vehicle) throw new Error(`Selected vehicle does not exist`);

    // Business rule check: cargoWeight <= vehicle maxLoadCapacity
    if (trip.cargoWeight > vehicle.maxLoadCapacity) {
      throw new Error(`Cargo weight (${trip.cargoWeight} kg) exceeds the selected vehicle's maximum load capacity (${vehicle.maxLoadCapacity} kg)`);
    }

    const id = 'trp-' + (this.data.trips.length + 1);
    const newTrip: Trip = {
      id,
      ...trip,
      status: 'Draft',
      createdAt: new Date().toISOString()
    };
    this.data.trips.push(newTrip);
    this.save();
    return this.getTrip(id)!;
  }

  dispatchTrip(id: string) {
    this.load();
    const trip = this.data.trips.find(t => t.id === id);
    if (!trip) throw new Error(`Trip ${id} not found`);
    if (trip.status !== 'Draft') throw new Error(`Trip is in ${trip.status} status, cannot dispatch`);

    const vehicle = this.data.vehicles.find(v => v.id === trip.vehicleId);
    const driver = this.data.drivers.find(d => d.id === trip.driverId);

    if (!vehicle || vehicle.status !== 'Available') {
      throw new Error(`Vehicle is not available for dispatch (Current status: ${vehicle?.status || 'Unknown'})`);
    }
    const today = new Date().toISOString().split('T')[0];
    if (!driver || driver.status !== 'Available' || driver.licenseExpiryDate <= today) {
      throw new Error(`Driver is not available or has an expired license for dispatch`);
    }

    // Transaction-like update: set trip, vehicle, and driver to OnTrip
    trip.status = 'Dispatched';
    vehicle.status = 'OnTrip';
    driver.status = 'OnTrip';

    this.save();
    return this.getTrip(id)!;
  }

  completeTrip(id: string, finalOdometer: number, fuelConsumed: number) {
    this.load();
    const trip = this.data.trips.find(t => t.id === id);
    if (!trip) throw new Error(`Trip ${id} not found`);
    if (trip.status !== 'Dispatched') throw new Error(`Only dispatched trips can be completed`);

    const vehicle = this.data.vehicles.find(v => v.id === trip.vehicleId);
    const driver = this.data.drivers.find(d => d.id === trip.driverId);

    if (!vehicle) throw new Error(`Trip vehicle not found`);
    if (!driver) throw new Error(`Trip driver not found`);

    if (finalOdometer < vehicle.odometer) {
      throw new Error(`Final odometer (${finalOdometer} km) cannot be less than the current odometer (${vehicle.odometer} km)`);
    }

    // Update trip details
    trip.status = 'Completed';
    trip.finalOdometer = finalOdometer;
    trip.fuelConsumed = fuelConsumed;

    // Reset vehicle and driver status
    vehicle.status = 'Available';
    vehicle.odometer = finalOdometer;
    driver.status = 'Available';

    // Log fuel consumption automatically in the Fuel Logs as well
    const fuelLogId = 'fuel-' + (this.data.fuelLogs.length + 1);
    this.data.fuelLogs.push({
      id: fuelLogId,
      vehicleId: vehicle.id,
      liters: fuelConsumed,
      cost: Number((fuelConsumed * 1.75).toFixed(2)), // Generate a realistic cost ($1.75 per liter)
      date: new Date().toISOString().split('T')[0]
    });

    this.save();
    return this.getTrip(id)!;
  }

  cancelTrip(id: string) {
    this.load();
    const trip = this.data.trips.find(t => t.id === id);
    if (!trip) throw new Error(`Trip ${id} not found`);
    if (trip.status !== 'Dispatched') throw new Error(`Only dispatched trips can be cancelled`);

    const vehicle = this.data.vehicles.find(v => v.id === trip.vehicleId);
    const driver = this.data.drivers.find(d => d.id === trip.driverId);

    trip.status = 'Cancelled';
    if (vehicle) vehicle.status = 'Available';
    if (driver) driver.status = 'Available';

    this.save();
    return this.getTrip(id)!;
  }

  // --- Maintenance logs ---
  getMaintenanceLogs() {
    this.load();
    return this.data.maintenanceLogs.map(m => ({
      ...m,
      vehicle: this.data.vehicles.find(v => v.id === m.vehicleId)
    }));
  }

  createMaintenanceLog(log: Omit<MaintenanceLog, 'id' | 'createdDate'>) {
    this.load();
    const vehicle = this.data.vehicles.find(v => v.id === log.vehicleId);
    if (!vehicle) throw new Error(`Vehicle ${log.vehicleId} not found`);

    const id = 'mnt-' + (this.data.maintenanceLogs.length + 1);
    const newLog: MaintenanceLog = {
      id,
      ...log,
      createdDate: new Date().toISOString()
    };

    this.data.maintenanceLogs.push(newLog);

    // Business rule: creating an ACTIVE maintenance log automatically switches vehicle to InShop
    if (log.status === 'Active') {
      vehicle.status = 'InShop';
    }

    this.save();
    return newLog;
  }

  closeMaintenanceLog(id: string) {
    this.load();
    const log = this.data.maintenanceLogs.find(m => m.id === id);
    if (!log) throw new Error(`Maintenance log ${id} not found`);
    if (log.status === 'Closed') throw new Error(`Maintenance log is already closed`);

    const vehicle = this.data.vehicles.find(v => v.id === log.vehicleId);

    log.status = 'Closed';
    log.closedDate = new Date().toISOString();

    // Business rule: closing maintenance restores the vehicle to Available (unless Retired)
    if (vehicle && vehicle.status !== 'Retired') {
      vehicle.status = 'Available';
    }

    // Add a corresponding expense for maintenance
    const expId = 'exp-' + (this.data.expenses.length + 1);
    this.data.expenses.push({
      id: expId,
      vehicleId: log.vehicleId,
      type: 'Maintenance Cost',
      amount: 350, // Standard mock maintenance amount
      date: new Date().toISOString().split('T')[0]
    });

    this.save();
    return log;
  }

  // --- Fuel logs ---
  getFuelLogs() {
    this.load();
    return this.data.fuelLogs.map(f => ({
      ...f,
      vehicle: this.data.vehicles.find(v => v.id === f.vehicleId)
    }));
  }

  createFuelLog(log: Omit<FuelLog, 'id'>) {
    this.load();
    const vehicle = this.data.vehicles.find(v => v.id === log.vehicleId);
    if (!vehicle) throw new Error(`Vehicle ${log.vehicleId} not found`);

    const id = 'fuel-' + (this.data.fuelLogs.length + 1);
    const newLog = { id, ...log };
    this.data.fuelLogs.push(newLog);
    this.save();
    return newLog;
  }

  // --- Expenses ---
  getExpenses() {
    this.load();
    return this.data.expenses.map(e => ({
      ...e,
      vehicle: this.data.vehicles.find(v => v.id === e.vehicleId)
    }));
  }

  createExpense(expense: Omit<Expense, 'id'>) {
    this.load();
    const vehicle = this.data.vehicles.find(v => v.id === expense.vehicleId);
    if (!vehicle) throw new Error(`Vehicle ${expense.vehicleId} not found`);

    const id = 'exp-' + (this.data.expenses.length + 1);
    const newExpense = { id, ...expense };
    this.data.expenses.push(newExpense);
    this.save();
    return newExpense;
  }

  // --- Dashboard KPIs ---
  getDashboardKPIs(): DashboardKPIs {
    this.load();
    const vehicles = this.data.vehicles;
    const trips = this.data.trips;
    const drivers = this.data.drivers;

    const activeVehicles = vehicles.filter(v => v.status !== 'Retired').length;
    const availableVehicles = vehicles.filter(v => v.status === 'Available').length;
    const vehiclesInMaintenance = vehicles.filter(v => v.status === 'InShop').length;

    const activeTrips = trips.filter(t => t.status === 'Dispatched').length;
    const pendingTrips = trips.filter(t => t.status === 'Draft').length;

    const driversOnDuty = drivers.filter(d => d.status === 'OnTrip').length;

    const activeVehiclesList = vehicles.filter(v => v.status !== 'Retired');
    const onTripCount = activeVehiclesList.filter(v => v.status === 'OnTrip').length;
    const fleetUtilization = activeVehicles > 0 
      ? Math.round((onTripCount / activeVehicles) * 100) 
      : 0;

    return {
      activeVehicles,
      availableVehicles,
      vehiclesInMaintenance,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      fleetUtilization
    };
  }

  // --- Reports & Analytics ---
  getVehicleReport(vehicleId: string): VehicleReport {
    this.load();
    const vehicle = this.getVehicle(vehicleId);
    if (!vehicle) throw new Error(`Vehicle ${vehicleId} not found`);

    const completedTrips = this.data.trips.filter(
      t => t.vehicleId === vehicleId && t.status === 'Completed'
    );

    const totalDistance = completedTrips.reduce((sum, t) => sum + t.plannedDistance, 0);
    const totalFuelConsumed = completedTrips.reduce((sum, t) => sum + (t.fuelConsumed || 0), 0);

    // fuelEfficiency = sum(plannedDistance) / sum(fuelConsumed)
    const fuelEfficiency = totalFuelConsumed > 0 
      ? Number((totalDistance / totalFuelConsumed).toFixed(2)) 
      : 0;

    // operationalCost = sum of fuel log costs + sum of maintenance-related expenses & other expenses
    const vehicleFuelCost = this.data.fuelLogs
      .filter(f => f.vehicleId === vehicleId)
      .reduce((sum, f) => sum + f.cost, 0);

    const vehicleExpenseCost = this.data.expenses
      .filter(e => e.vehicleId === vehicleId)
      .reduce((sum, e) => sum + e.amount, 0);

    const operationalCost = vehicleFuelCost + vehicleExpenseCost;

    // revenue = mock cargo weight * distance or simply a formula like $2.00 per km
    // Let's compute a logical revenue: distance * cargoWeight / 1000 * 0.5 + flat fee
    const revenue = completedTrips.reduce((sum, t) => {
      const cargoFactor = t.cargoWeight / 1000; // per ton
      return sum + (t.plannedDistance * 1.5) + (cargoFactor * 50);
    }, 0);

    // roi = (revenue - operationalCost) / acquisitionCost
    const roi = vehicle.acquisitionCost > 0 
      ? Number(((revenue - operationalCost) / vehicle.acquisitionCost).toFixed(4)) 
      : 0;

    return {
      fuelEfficiency,
      operationalCost,
      roi,
      revenue: Number(revenue.toFixed(2)),
      completedTripsCount: completedTrips.length
    };
  }
}

export const db = new Database();
