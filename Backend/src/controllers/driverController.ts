import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Driver } from '../entities/Driver';
import { messages } from '../config/messages';

export async function getDrivers(req: Request, res: Response) {
  try {
    const driverRepo = AppDataSource.getRepository(Driver);
    const drivers = await driverRepo.find({ order: { id: 'ASC' } });
    return res.json(drivers);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || messages.general.serverError });
  }
}

export async function getDriver(req: Request, res: Response) {
  try {
    const driverRepo = AppDataSource.getRepository(Driver);
    const driver = await driverRepo.findOne({ where: { id: Number(req.params.id) } });
    if (!driver) {
      return res.status(404).json({ error: messages.driver.notFound });
    }
    return res.json(driver);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || messages.general.serverError });
  }
}

export async function createDriver(req: Request, res: Response) {
  try {
    const { name, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber, safetyScore, status } = req.body;
    const driverRepo = AppDataSource.getRepository(Driver);

    const existing = await driverRepo.findOne({ where: { licenseNumber } });
    if (existing) {
      return res.status(400).json({ error: messages.driver.alreadyExists });
    }

    const driver = driverRepo.create({
      name,
      licenseNumber,
      licenseCategory,
      licenseExpiryDate,
      contactNumber,
      safetyScore: safetyScore !== undefined ? Number(safetyScore) : 100,
      status: status || 'active'
    });

    await driverRepo.save(driver);
    return res.status(201).json(driver);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || messages.general.serverError });
  }
}

export async function updateDriver(req: Request, res: Response) {
  try {
    const driverRepo = AppDataSource.getRepository(Driver);
    const driver = await driverRepo.findOne({ where: { id: Number(req.params.id) } });

    if (!driver) {
      return res.status(404).json({ error: messages.driver.notFound });
    }

    const { name, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber, safetyScore, status } = req.body;

    if (name) driver.name = name;
    if (licenseNumber) driver.licenseNumber = licenseNumber;
    if (licenseCategory) driver.licenseCategory = licenseCategory;
    if (licenseExpiryDate) driver.licenseExpiryDate = licenseExpiryDate;
    if (contactNumber) driver.contactNumber = contactNumber;
    if (safetyScore !== undefined) driver.safetyScore = Number(safetyScore);
    if (status) driver.status = status;

    await driverRepo.save(driver);
    return res.json(driver);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || messages.general.serverError });
  }
}

export async function deleteDriver(req: Request, res: Response) {
  try {
    const driverRepo = AppDataSource.getRepository(Driver);
    const driver = await driverRepo.findOne({ where: { id: Number(req.params.id) } });
    if (!driver) {
      return res.status(404).json({ error: messages.driver.notFound });
    }
    driver.status = 'inactive';
    await driverRepo.save(driver);
    return res.json({ message: 'Driver status updated to inactive' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || messages.general.serverError });
  }
}
