import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Expense } from '../entities/Expense';
import { Vehicle } from '../entities/Vehicle';
import { messages } from '../config/messages';

export async function getExpenses(req: Request, res: Response) {
  try {
    const expenseRepo = AppDataSource.getRepository(Expense);
    const expenses = await expenseRepo.find({
      relations: ['vehicle'],
      order: { id: 'DESC' }
    });
    return res.json(expenses);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || messages.general.serverError });
  }
}

export async function createExpense(req: Request, res: Response) {
  try {
    const { vehicleId, type, amount, date, status } = req.body;
    const expenseRepo = AppDataSource.getRepository(Expense);
    const vehicleRepo = AppDataSource.getRepository(Vehicle);

    const vehicle = await vehicleRepo.findOne({ where: { id: Number(vehicleId) } });
    if (!vehicle) {
      return res.status(404).json({ error: messages.vehicle.notFound });
    }

    const expense = expenseRepo.create({
      vehicleId: Number(vehicleId),
      type,
      amount: Number(amount),
      date,
      status: status || 'active'
    });

    await expenseRepo.save(expense);
    const savedExpense = await expenseRepo.findOne({
      where: { id: expense.id },
      relations: ['vehicle']
    });
    return res.status(201).json(savedExpense);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || messages.general.serverError });
  }
}

export async function updateExpense(req: Request, res: Response) {
  try {
    const expenseRepo = AppDataSource.getRepository(Expense);
    const expense = await expenseRepo.findOne({ where: { id: Number(req.params.id) } });

    if (!expense) {
      return res.status(404).json({ error: messages.expense.notFound });
    }

    const { type, amount, date, status, vehicleId } = req.body;

    if (vehicleId) {
      const vehicleRepo = AppDataSource.getRepository(Vehicle);
      const vehicle = await vehicleRepo.findOne({ where: { id: Number(vehicleId) } });
      if (!vehicle) {
        return res.status(404).json({ error: messages.vehicle.notFound });
      }
      expense.vehicleId = Number(vehicleId);
    }
    if (type) expense.type = type;
    if (amount !== undefined) expense.amount = Number(amount);
    if (date) expense.date = date;
    if (status) expense.status = status;

    await expenseRepo.save(expense);
    const updated = await expenseRepo.findOne({
      where: { id: expense.id },
      relations: ['vehicle']
    });
    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || messages.general.serverError });
  }
}

export async function deleteExpense(req: Request, res: Response) {
  try {
    const expenseRepo = AppDataSource.getRepository(Expense);
    const expense = await expenseRepo.findOne({ where: { id: Number(req.params.id) } });
    if (!expense) {
      return res.status(404).json({ error: messages.expense.notFound });
    }
    expense.status = 'inactive';
    await expenseRepo.save(expense);
    return res.json({ message: 'Expense status updated to inactive' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || messages.general.serverError });
  }
}
