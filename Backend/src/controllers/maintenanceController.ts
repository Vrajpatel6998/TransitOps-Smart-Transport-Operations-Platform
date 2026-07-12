import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { MaintenanceLog } from '../entities/MaintenanceLog';
import { Vehicle } from '../entities/Vehicle';
import { messages } from '../config/messages';

export async function getMaintenanceLogs(req: Request, res: Response) {
  try {
    const logRepo = AppDataSource.getRepository(MaintenanceLog);
    const logs = await logRepo.find({
      relations: ['vehicle'],
      order: { id: 'DESC' }
    });
    return res.json(logs);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || messages.general.serverError });
  }
}

export async function createMaintenanceLog(req: Request, res: Response) {
  try {
    const { vehicleId, description, cost, date, status } = req.body;
    const logRepo = AppDataSource.getRepository(MaintenanceLog);
    const vehicleRepo = AppDataSource.getRepository(Vehicle);

    const vehicle = await vehicleRepo.findOne({ where: { id: Number(vehicleId) } });
    if (!vehicle) {
      return res.status(404).json({ error: messages.vehicle.notFound });
    }

    const log = logRepo.create({
      vehicleId: Number(vehicleId),
      description,
      cost: cost !== undefined ? Number(cost) : 0,
      date,
      status: status || 'active'
    });

    await logRepo.save(log);
    // Reload log with vehicle details
    const savedLog = await logRepo.findOne({
      where: { id: log.id },
      relations: ['vehicle']
    });
    return res.status(201).json(savedLog);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || messages.general.serverError });
  }
}

export async function updateMaintenanceLog(req: Request, res: Response) {
  try {
    const logRepo = AppDataSource.getRepository(MaintenanceLog);
    const log = await logRepo.findOne({ where: { id: Number(req.params.id) } });

    if (!log) {
      return res.status(404).json({ error: messages.maintenance.notFound });
    }

    const { description, cost, date, status, vehicleId } = req.body;

    if (vehicleId) {
      const vehicleRepo = AppDataSource.getRepository(Vehicle);
      const vehicle = await vehicleRepo.findOne({ where: { id: Number(vehicleId) } });
      if (!vehicle) {
        return res.status(404).json({ error: messages.vehicle.notFound });
      }
      log.vehicleId = Number(vehicleId);
    }
    if (description) log.description = description;
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

export async function deleteMaintenanceLog(req: Request, res: Response) {
  try {
    const logRepo = AppDataSource.getRepository(MaintenanceLog);
    const log = await logRepo.findOne({ where: { id: Number(req.params.id) } });
    if (!log) {
      return res.status(404).json({ error: messages.maintenance.notFound });
    }
    log.status = 'inactive';
    await logRepo.save(log);
    return res.json({ message: 'Maintenance log updated to inactive' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || messages.general.serverError });
  }
}
