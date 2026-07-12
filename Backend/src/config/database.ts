import "reflect-metadata";
import { DataSource } from "typeorm";
import { Role } from "../entities/Role";
import { User } from "../entities/User";
import { Vehicle } from "../entities/Vehicle";
import { Driver } from "../entities/Driver";
import { MaintenanceLog } from "../entities/MaintenanceLog";
import { FuelLog } from "../entities/FuelLog";
import { Expense } from "../entities/Expense";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.DATABASE_URL || "postgresql://postgres:1234@localhost:5432/transitops?schema=public";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: dbUrl,
  synchronize: true, // Automaticaly synchronizes database schema
  logging: false,
  entities: [Role, User, Vehicle, Driver, MaintenanceLog, FuelLog, Expense],
  migrations: [],
  subscribers: [],
});
