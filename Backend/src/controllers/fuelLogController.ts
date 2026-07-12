import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { FuelLog } from '../entities/FuelLog';
import { Vehicle } from '../entities/Vehicle';
import { messages } from '../config/messages';

export async function getFuelLogs(req: Request, res: Response) {
  try {
    const logRepo = AppDataSource.getRepository(FuelLog);
    const logs = await logRepo.find({
      relations: ['vehicle'],
      order: { id: 'DESC' }
    });
    return res.json(logs);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || messages.general.serverError });
  }
}

export async function createFuelLog(req: Request, res: Response) {
  try {
    const { vehicleId, liters, cost, date, status } = req.body;
    const logRepo = AppDataSource.getRepository(FuelLog);
    const vehicleRepo = AppDataSource.getRepository(Vehicle);

    const vehicle = await vehicleRepo.findOne({ where: { id: Number(vehicleId) } });
    if (!vehicle) {
      return res.status(404).json({ error: messages.vehicle.notFound });
    }

    const log = logRepo.create({
      vehicleId: Number(vehicleId),
      liters: Number(liters),
      cost: Number(cost),
      date,
      status: status || 'active'
    });

    await logRepo.save(log);
    const savedLog = await logRepo.findOne({
      where: { id: log.id },
      relations: ['vehicle']
    });
    return res.status(201).json(savedLog);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || messages.general.serverError });
  }
}

export async function updateFuelLog(req: Request, res: Response) {
  try {
    const logRepo = AppDataSource.getRepository(FuelLog);
    const log = await logRepo.findOne({ where: { id: Number(req.params.id) } });

    if (!log) {
      return res.status(404).json({ error: messages.fuelLog.notFound });
    }

    const { liters, cost, date, status, vehicleId } = req.body;

    if (vehicleId) {
      const vehicleRepo = AppDataSource.getRepository(Vehicle);
      const vehicle = await vehicleRepo.findOne({ where: { id: Number(vehicleId) } });
      if (!vehicle) {
        return res.status(404).json({ error: messages.vehicle.notFound });
      }
      log.vehicleId = Number(vehicleId);
    }
    if (liters !== undefined) log.liters = Number(liters);
    if (cost !== undefined) log.cost = Number(cost);
    if (date) log.date = date;
    if (status) log.status = status;

    await logRepo.save(log);
    const updated = await logRepo.findOne({
      where: { id: log.id },
      relations: ['vehicle']
    });
    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || messages.general.serverError });
  }
}

export async function deleteFuelLog(req: Request, res: Response) {
  try {
    const logRepo = AppDataSource.getRepository(FuelLog);
    const log = await logRepo.findOne({ where: { id: Number(req.params.id) } });
    if (!log) {
      return res.status(404).json({ error: messages.fuelLog.notFound });
    }
    log.status = 'inactive';
    await logRepo.save(log);
    return res.json({ message: 'Fuel log status updated to inactive' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || messages.general.serverError });
  }
}
