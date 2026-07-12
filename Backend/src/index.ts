import "reflect-metadata";
import app from "./app";
import { AppDataSource } from "./config/database";
import { Role } from "./entities/Role";
import { User } from "./entities/User";
import { Vehicle } from "./entities/Vehicle";
import { Driver } from "./entities/Driver";
import { FuelLog } from "./entities/FuelLog";
import { Expense } from "./entities/Expense";
import { MaintenanceLog } from "./entities/MaintenanceLog";
import { hashPassword } from "./utils/hash";
import dotenv from "dotenv";

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

async function seed() {
  const roleRepo = AppDataSource.getRepository(Role);
  const userRepo = AppDataSource.getRepository(User);
  const vehicleRepo = AppDataSource.getRepository(Vehicle);
  const driverRepo = AppDataSource.getRepository(Driver);
  const fuelRepo = AppDataSource.getRepository(FuelLog);
  const expenseRepo = AppDataSource.getRepository(Expense);
  const maintRepo = AppDataSource.getRepository(MaintenanceLog);

  // 1. Seed Roles
  const rolesToSeed = ['Admin', 'FleetManager', 'Driver', 'SafetyOfficer', 'FinancialAnalyst'];
  for (const name of rolesToSeed) {
    const exists = await roleRepo.findOne({ where: { name } });
    if (!exists) {
      const newRole = roleRepo.create({ name, status: 'active' });
      await roleRepo.save(newRole);
    }
  }

  // Fetch created roles mapping
  const roles = await roleRepo.find();
  const getRoleId = (name: string) => roles.find(r => r.name === name)!.id;

  // 2. Seed Users
  const usersToSeed = [
    { name: 'Nishant Admin', email: 'admin@transitops.com', password: 'admin123', role: 'Admin' },
    { name: 'Marcus Fleet', email: 'manager@transitops.com', password: 'manager123', role: 'FleetManager' },
    { name: 'Alex Driver', email: 'driver@transitops.com', password: 'driver123', role: 'Driver' },
    { name: 'Sarah Safety', email: 'safety@transitops.com', password: 'safety123', role: 'SafetyOfficer' },
    { name: 'Fiona Finance', email: 'finance@transitops.com', password: 'finance123', role: 'FinancialAnalyst' }
  ];

  for (const item of usersToSeed) {
    const exists = await userRepo.findOne({ where: { email: item.email } });
    if (!exists) {
      const passwordHash = await hashPassword(item.password);
      const newUser = userRepo.create({
        name: item.name,
        email: item.email,
        passwordHash,
        roleId: getRoleId(item.role),
        status: 'active'
      });
      await userRepo.save(newUser);
    }
  }

  // 3. Seed Vehicles
  const vehicleCount = await vehicleRepo.count();
  if (vehicleCount === 0) {
    const vehicles = [
      { registrationNumber: 'CA-992-FL', nameModel: 'Freightliner M2 106', type: 'Heavy Truck', maxLoadCapacity: 12000, odometer: 145200, acquisitionCost: 85000, status: 'active' as const, region: 'West Coast' },
      { registrationNumber: 'TX-817-TX', nameModel: 'Ford F-550 Super Duty', type: 'Flatbed', maxLoadCapacity: 8000, odometer: 82400, acquisitionCost: 62000, status: 'active' as const, region: 'South Region' },
      { registrationNumber: 'NY-334-OP', nameModel: 'Mercedes-Benz Sprinter 3500', type: 'Cargo Van', maxLoadCapacity: 3500, odometer: 42100, acquisitionCost: 48000, status: 'active' as const, region: 'East Coast' }
    ];
    for (const v of vehicles) {
      await vehicleRepo.save(vehicleRepo.create(v));
    }
  }

  // 4. Seed Drivers
  const driverCount = await driverRepo.count();
  if (driverCount === 0) {
    const drivers = [
      { name: 'Alex Rivera', licenseNumber: 'DL-9948271', licenseCategory: 'Class A CDL', licenseExpiryDate: '2028-11-15', contactNumber: '+1 (555) 019-2831', safetyScore: 94.00, status: 'active' as const },
      { name: 'Marcus Vance', licenseNumber: 'DL-4819283', licenseCategory: 'Class B CDL', licenseExpiryDate: '2027-04-20', contactNumber: '+1 (555) 014-9982', safetyScore: 88.00, status: 'active' as const }
    ];
    for (const d of drivers) {
      await driverRepo.save(driverRepo.create(d));
    }
  }

  // 5. Seed Logs if vehicles exist
  const seededVehicles = await vehicleRepo.find();
  if (seededVehicles.length > 0) {
    const vId = seededVehicles[0].id;
    
    const fuelCount = await fuelRepo.count();
    if (fuelCount === 0) {
      await fuelRepo.save(fuelRepo.create({ vehicleId: vId, liters: 120, cost: 450, date: '2026-07-10', status: 'active' as const }));
      await fuelRepo.save(fuelRepo.create({ vehicleId: vId, liters: 95, cost: 360, date: '2026-07-11', status: 'active' as const }));
    }

    const expenseCount = await expenseRepo.count();
    if (expenseCount === 0) {
      await expenseRepo.save(expenseRepo.create({ vehicleId: vId, type: 'Toll', amount: 35, date: '2026-07-09', status: 'active' as const }));
      await expenseRepo.save(expenseRepo.create({ vehicleId: vId, type: 'Insurance', amount: 250, date: '2026-07-01', status: 'active' as const }));
    }

    const maintCount = await maintRepo.count();
    if (maintCount === 0) {
      await maintRepo.save(maintRepo.create({ vehicleId: vId, description: 'Engine oil change and filter replacement', cost: 150, date: '2026-07-05', status: 'active' }));
    }
  }

  console.log("Database seeded successfully!");
}

AppDataSource.initialize()
  .then(async () => {
    console.log("PostgreSQL Database connected successfully via TypeORM!");
    await seed();
    app.listen(PORT, () => {
      console.log(`TransitOps Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
