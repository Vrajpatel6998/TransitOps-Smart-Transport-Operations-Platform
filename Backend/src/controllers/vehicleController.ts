import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Vehicle } from '../entities/Vehicle';
import { MaintenanceLog } from '../entities/MaintenanceLog';
import { Driver } from '../entities/Driver';
import { FuelLog } from '../entities/FuelLog';
import { Expense } from '../entities/Expense';
import { messages } from '../config/messages';

export async function getVehicles(req: Request, res: Response) {
  try {
    const vehicleRepo = AppDataSource.getRepository(Vehicle);
    const vehicles = await vehicleRepo.find({ order: { id: 'ASC' } });
    return res.json(vehicles);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || messages.general.serverError });
  }
}

export async function getVehicle(req: Request, res: Response) {
  try {
    const vehicleRepo = AppDataSource.getRepository(Vehicle);
    const vehicle = await vehicleRepo.findOne({ where: { id: Number(req.params.id) } });
    if (!vehicle) {
      return res.status(404).json({ error: messages.vehicle.notFound });
    }
    return res.json(vehicle);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || messages.general.serverError });
  }
}

export async function createVehicle(req: Request, res: Response) {
  try {
    const { registrationNumber, nameModel, type, maxLoadCapacity, odometer, acquisitionCost, region, status } = req.body;
    const vehicleRepo = AppDataSource.getRepository(Vehicle);

    const existing = await vehicleRepo.findOne({ where: { registrationNumber } });
    if (existing) {
      return res.status(400).json({ error: messages.vehicle.alreadyExists });
    }

    const vehicle = vehicleRepo.create({
      registrationNumber,
      nameModel,
      type,
      maxLoadCapacity: Number(maxLoadCapacity),
      odometer: Number(odometer),
      acquisitionCost: Number(acquisitionCost),
      region: region || '',
      status: status || 'active'
    });

    await vehicleRepo.save(vehicle);
    return res.status(201).json(vehicle);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || messages.general.serverError });
  }
}

export async function updateVehicle(req: Request, res: Response) {
  try {
    const vehicleRepo = AppDataSource.getRepository(Vehicle);
    const vehicle = await vehicleRepo.findOne({ where: { id: Number(req.params.id) } });

    if (!vehicle) {
      return res.status(404).json({ error: messages.vehicle.notFound });
    }

    const { registrationNumber, nameModel, type, maxLoadCapacity, odometer, acquisitionCost, region, status } = req.body;

    if (registrationNumber) vehicle.registrationNumber = registrationNumber;
    if (nameModel) vehicle.nameModel = nameModel;
    if (type) vehicle.type = type;
    if (maxLoadCapacity !== undefined) vehicle.maxLoadCapacity = Number(maxLoadCapacity);
    if (odometer !== undefined) vehicle.odometer = Number(odometer);
    if (acquisitionCost !== undefined) vehicle.acquisitionCost = Number(acquisitionCost);
    if (region !== undefined) vehicle.region = region;
    if (status) vehicle.status = status;

    await vehicleRepo.save(vehicle);
    return res.json(vehicle);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || messages.general.serverError });
  }
}

export async function deleteVehicle(req: Request, res: Response) {
  try {
    const vehicleRepo = AppDataSource.getRepository(Vehicle);
    const vehicle = await vehicleRepo.findOne({ where: { id: Number(req.params.id) } });
    if (!vehicle) {
      return res.status(404).json({ error: messages.vehicle.notFound });
    }
    vehicle.status = 'inactive';
    await vehicleRepo.save(vehicle);
    return res.json({ message: 'Vehicle set to inactive status' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || messages.general.serverError });
  }
}

export async function getDashboardKPIs(req: Request, res: Response) {
  try {
    const vehicleRepo = AppDataSource.getRepository(Vehicle);
    const driverRepo = AppDataSource.getRepository(Driver);
    const maintRepo = AppDataSource.getRepository(MaintenanceLog);
    const fuelRepo = AppDataSource.getRepository(FuelLog);
    const expenseRepo = AppDataSource.getRepository(Expense);

    const totalVehicles = await vehicleRepo.count({ where: { status: 'active' } });
    const inactiveVehicles = await vehicleRepo.count({ where: { status: 'inactive' } });
    const activeDrivers = await driverRepo.count({ where: { status: 'active' } });
    const activeMaint = await maintRepo.count({ where: { status: 'active' } });

    const fuelLogs = await fuelRepo.find();
    const totalFuelCost = fuelLogs.reduce((acc, log) => acc + Number(log.cost), 0);
    const totalLiters = fuelLogs.reduce((acc, log) => acc + Number(log.liters), 0);

    const expenses = await expenseRepo.find();
    const totalExpenses = expenses.reduce((acc, exp) => acc + Number(exp.amount), 0);

    return res.json({
      activeVehicles: totalVehicles,
      inactiveVehicles,
      availableVehicles: totalVehicles - activeMaint,
      vehiclesInMaintenance: activeMaint,
      activeDrivers,
      totalFuelCost,
      totalLiters,
      totalExpenses
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || messages.general.serverError });
  }
}
