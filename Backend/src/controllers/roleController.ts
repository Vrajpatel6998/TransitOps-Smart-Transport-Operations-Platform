import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Role } from '../entities/Role';
import { messages } from '../config/messages';

export async function getRoles(req: Request, res: Response) {
  try {
    const roleRepo = AppDataSource.getRepository(Role);
    const roles = await roleRepo.find();
    return res.json(roles);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || messages.general.serverError });
  }
}

export async function createRole(req: Request, res: Response) {
  try {
    const { name, status } = req.body;
    const roleRepo = AppDataSource.getRepository(Role);

    const existingRole = await roleRepo.findOne({ where: { name } });
    if (existingRole) {
      return res.status(400).json({ error: messages.role.alreadyExists });
    }

    const newRole = roleRepo.create({
      name,
      status: status || 'active'
    });

    await roleRepo.save(newRole);
    return res.status(201).json(newRole);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || messages.general.serverError });
  }
}
