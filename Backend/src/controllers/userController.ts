import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { messages } from '../config/messages';

export async function getUsers(req: Request, res: Response) {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const users = await userRepo.find({
      relations: ['role'],
      order: { id: 'ASC' }
    });
    // Remove password hash from response
    const usersResponse = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role?.name || 'unknown',
      roleId: u.roleId,
      status: u.status,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt
    }));
    return res.json(usersResponse);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || messages.general.serverError });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const userId = Number(req.params.id);
    const { name, email, roleId, status } = req.body;
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: messages.user.notFound });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (roleId) user.roleId = roleId;
    if (status) user.status = status;

    await userRepo.save(user);

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      status: user.status
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || messages.general.serverError });
  }
}
