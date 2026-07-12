export type UserRole = 'Admin' | 'FleetManager' | 'Driver' | 'SafetyOfficer' | 'FinancialAnalyst';
export type ActiveStatus = 'active' | 'inactive';

export interface Role {
  id: number;
  name: string;
  status: ActiveStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  roleId?: number;
  status: ActiveStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Vehicle {
  id: number;
  registrationNumber: string;
  nameModel: string;
  type: string;
  maxLoadCapacity: number;
  odometer: number;
  acquisitionCost: number;
  region?: string;
  status: ActiveStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Driver {
  id: number;
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiryDate: string;
  contactNumber: string;
  safetyScore: number;
  status: ActiveStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface MaintenanceLog {
  id: number;
  vehicleId: number;
  vehicle?: Vehicle;
  description: string;
  cost: number;
  date: string;
  status: ActiveStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface FuelLog {
  id: number;
  vehicleId: number;
  vehicle?: Vehicle;
  liters: number;
  cost: number;
  date: string;
  status: ActiveStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Expense {
  id: number;
  vehicleId: number;
  vehicle?: Vehicle;
  type: string;
  amount: number;
  date: string;
  status: ActiveStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardKPIs {
  activeVehicles: number;
  inactiveVehicles: number;
  availableVehicles: number;
  vehiclesInMaintenance: number;
  activeDrivers: number;
  totalFuelCost: number;
  totalLiters: number;
  totalExpenses: number;
}
