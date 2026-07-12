import { Request, Response, NextFunction } from 'express';
import { messages } from '../config/messages';

export function validateLogin(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: messages.validation.invalidEmail });
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: messages.validation.passwordLength });
  }
  next();
}

export function validateSignup(req: Request, res: Response, next: NextFunction) {
  const { name, email, password, roleId, status } = req.body;
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: messages.validation.requiredFields });
  }
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: messages.validation.invalidEmail });
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: messages.validation.passwordLength });
  }
  if (!roleId || typeof roleId !== 'number') {
    return res.status(400).json({ error: messages.validation.requiredFields });
  }
  if (status && status !== 'active' && status !== 'inactive') {
    return res.status(400).json({ error: messages.validation.invalidStatus });
  }
  next();
}

export function validateVehicle(req: Request, res: Response, next: NextFunction) {
  const { registrationNumber, nameModel, type, maxLoadCapacity, odometer, acquisitionCost, status } = req.body;
  if (!registrationNumber || typeof registrationNumber !== 'string' || registrationNumber.trim() === '') {
    return res.status(400).json({ error: messages.validation.requiredFields });
  }
  if (!nameModel || typeof nameModel !== 'string' || nameModel.trim() === '') {
    return res.status(400).json({ error: messages.validation.requiredFields });
  }
  if (!type || typeof type !== 'string' || type.trim() === '') {
    return res.status(400).json({ error: messages.validation.requiredFields });
  }
  if (maxLoadCapacity === undefined || isNaN(Number(maxLoadCapacity)) || Number(maxLoadCapacity) < 0) {
    return res.status(400).json({ error: messages.validation.invalidNumber });
  }
  if (odometer === undefined || isNaN(Number(odometer)) || Number(odometer) < 0) {
    return res.status(400).json({ error: messages.validation.invalidNumber });
  }
  if (acquisitionCost === undefined || isNaN(Number(acquisitionCost)) || Number(acquisitionCost) < 0) {
    return res.status(400).json({ error: messages.validation.invalidNumber });
  }
  if (status && status !== 'active' && status !== 'inactive') {
    return res.status(400).json({ error: messages.validation.invalidStatus });
  }
  next();
}

export function validateDriver(req: Request, res: Response, next: NextFunction) {
  const { name, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber, safetyScore, status } = req.body;
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: messages.validation.requiredFields });
  }
  if (!licenseNumber || typeof licenseNumber !== 'string' || licenseNumber.trim() === '') {
    return res.status(400).json({ error: messages.validation.requiredFields });
  }
  if (!licenseCategory || typeof licenseCategory !== 'string' || licenseCategory.trim() === '') {
    return res.status(400).json({ error: messages.validation.requiredFields });
  }
  if (!licenseExpiryDate || isNaN(Date.parse(licenseExpiryDate))) {
    return res.status(400).json({ error: messages.validation.invalidDate });
  }
  if (!contactNumber || typeof contactNumber !== 'string' || contactNumber.trim() === '') {
    return res.status(400).json({ error: messages.validation.requiredFields });
  }
  if (safetyScore !== undefined && (isNaN(Number(safetyScore)) || Number(safetyScore) < 0 || Number(safetyScore) > 100)) {
    return res.status(400).json({ error: messages.validation.invalidNumber });
  }
  if (status && status !== 'active' && status !== 'inactive') {
    return res.status(400).json({ error: messages.validation.invalidStatus });
  }
  next();
}

export function validateMaintenanceLog(req: Request, res: Response, next: NextFunction) {
  const { vehicleId, description, cost, date, status } = req.body;
  if (!vehicleId || typeof vehicleId !== 'number') {
    return res.status(400).json({ error: messages.validation.requiredFields });
  }
  if (!description || typeof description !== 'string' || description.trim() === '') {
    return res.status(400).json({ error: messages.validation.requiredFields });
  }
  if (cost !== undefined && (isNaN(Number(cost)) || Number(cost) < 0)) {
    return res.status(400).json({ error: messages.validation.invalidNumber });
  }
  if (!date || isNaN(Date.parse(date))) {
    return res.status(400).json({ error: messages.validation.invalidDate });
  }
  if (status && status !== 'active' && status !== 'inactive') {
    return res.status(400).json({ error: messages.validation.invalidStatus });
  }
  next();
}

export function validateFuelLog(req: Request, res: Response, next: NextFunction) {
  const { vehicleId, liters, cost, date, status } = req.body;
  if (!vehicleId || typeof vehicleId !== 'number') {
    return res.status(400).json({ error: messages.validation.requiredFields });
  }
  if (liters === undefined || isNaN(Number(liters)) || Number(liters) <= 0) {
    return res.status(400).json({ error: messages.validation.invalidNumber });
  }
  if (cost === undefined || isNaN(Number(cost)) || Number(cost) <= 0) {
    return res.status(400).json({ error: messages.validation.invalidNumber });
  }
  if (!date || isNaN(Date.parse(date))) {
    return res.status(400).json({ error: messages.validation.invalidDate });
  }
  if (status && status !== 'active' && status !== 'inactive') {
    return res.status(400).json({ error: messages.validation.invalidStatus });
  }
  next();
}

export function validateExpense(req: Request, res: Response, next: NextFunction) {
  const { vehicleId, type, amount, date, status } = req.body;
  if (!vehicleId || typeof vehicleId !== 'number') {
    return res.status(400).json({ error: messages.validation.requiredFields });
  }
  if (!type || typeof type !== 'string' || type.trim() === '') {
    return res.status(400).json({ error: messages.validation.requiredFields });
  }
  if (amount === undefined || isNaN(Number(amount)) || Number(amount) <= 0) {
    return res.status(400).json({ error: messages.validation.invalidNumber });
  }
  if (!date || isNaN(Date.parse(date))) {
    return res.status(400).json({ error: messages.validation.invalidDate });
  }
  if (status && status !== 'active' && status !== 'inactive') {
    return res.status(400).json({ error: messages.validation.invalidStatus });
  }
  next();
}
