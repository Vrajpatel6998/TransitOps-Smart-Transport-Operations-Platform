import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { Role } from '../entities/Role';
import { comparePasswords, hashPassword } from '../utils/hash';
import { signToken } from '../middlewares/authMiddleware';
import { messages } from '../config/messages';

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: messages.auth.invalidCredentials });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: messages.auth.accountDeactivated });
    }

    const isMatch = await comparePasswords(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: messages.auth.invalidCredentials });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role.name,
    });

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        status: user.status
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || messages.general.serverError });
  }
}

export async function signup(req: Request, res: Response) {
  try {
    const { name, email, password, roleId, status } = req.body;
    const userRepo = AppDataSource.getRepository(User);
    const roleRepo = AppDataSource.getRepository(Role);

    const existingUser = await userRepo.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: messages.auth.emailExists });
    }

    const role = await roleRepo.findOne({ where: { id: roleId } });
    if (!role) {
      return res.status(400).json({ error: messages.role.notFound });
    }

    const passwordHash = await hashPassword(password);
    const newUser = userRepo.create({
      name,
      email,
      passwordHash,
      roleId,
      status: status || 'active'
    });

    await userRepo.save(newUser);

    return res.status(201).json({
      message: messages.auth.userCreated,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: role.name,
        status: newUser.status
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || messages.general.serverError });
  }
}

export async function getProfile(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: messages.auth.unauthorized });
    }
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id: req.user.userId } });
    if (!user) {
      return res.status(404).json({ error: messages.user.notFound });
    }
    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
      status: user.status
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || messages.general.serverError });
  }
}
