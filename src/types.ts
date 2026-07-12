/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'Admin' | 'FleetManager' | 'Driver' | 'SafetyOfficer' | 'FinancialAnalyst';
export type UserStatus = 'Active' | 'Inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export type VehicleStatus = 'Available' | 'OnTrip' | 'InShop' | 'Retired';

export interface Vehicle {
  id: string;
  registrationNumber: string;
  nameModel: string;
  type: string;
  maxLoadCapacity: number; // in kg
  odometer: number; // in km
  acquisitionCost: number; // in USD
  status: VehicleStatus;
  region?: string; // For filtering
}

export type DriverStatus = 'Available' | 'OnTrip' | 'OffDuty' | 'Suspended';

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiryDate: string; // ISO Date String YYYY-MM-DD
  contactNumber: string;
  safetyScore: number; // 0 to 100
  status: DriverStatus;
}

export type TripStatus = 'Draft' | 'Dispatched' | 'Completed' | 'Cancelled';

export interface Trip {
  id: string;
  source: string;
  destination: string;
  vehicleId: string;
  driverId: string;
  cargoWeight: number; // in kg
  plannedDistance: number; // in km
  status: TripStatus;
  finalOdometer?: number; // in km (on completion)
  fuelConsumed?: number; // in liters (on completion)
  createdAt: string; // ISO Date String
  // Joined fields for frontend ease
  vehicle?: Vehicle;
  driver?: Driver;
}

export type MaintenanceStatus = 'Active' | 'Closed';

export interface MaintenanceLog {
  id: string;
  vehicleId: string;
  description: string;
  status: MaintenanceStatus;
  createdDate: string; // ISO Date String
  closedDate?: string; // ISO Date String
  // Joined fields
  vehicle?: Vehicle;
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  liters: number;
  cost: number;
  date: string; // ISO Date String
  // Joined fields
  vehicle?: Vehicle;
}

export interface Expense {
  id: string;
  vehicleId: string;
  type: string; // e.g. "Toll", "Insurance", "Permit", "Fine", "Other"
  amount: number;
  date: string; // ISO Date String
  // Joined fields
  vehicle?: Vehicle;
}

export interface DashboardKPIs {
  activeVehicles: number; // status != Retired
  availableVehicles: number; // status == Available
  vehiclesInMaintenance: number; // status == InShop
  activeTrips: number; // status == Dispatched
  pendingTrips: number; // status == Draft
  driversOnDuty: number; // status == OnTrip
  fleetUtilization: number; // % of active vehicles that are OnTrip
}

export interface VehicleReport {
  fuelEfficiency: number; // sum(plannedDistance of Completed trips) / sum(fuelConsumed)
  operationalCost: number; // sum(fuel cost) + sum(maintenance logs cost + expenses)
  roi: number; // (revenue - operationalCost) / acquisitionCost
  revenue: number; // mock or calculated revenue (e.g. 2.5 USD per planned km completed)
  completedTripsCount: number;
}
