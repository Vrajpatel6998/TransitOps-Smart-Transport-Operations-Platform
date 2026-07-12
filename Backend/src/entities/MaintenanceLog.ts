import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Vehicle } from "./Vehicle";

@Entity({ name: "maintenance_logs" })
export class MaintenanceLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "vehicle_id", type: "int" })
  vehicleId!: number;

  @ManyToOne(() => Vehicle, { eager: true })
  @JoinColumn({ name: "vehicle_id" })
  vehicle!: Vehicle;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0.00 })
  cost!: number;

  @Column({ type: "date" })
  date!: string;

  @Column({ type: "varchar", length: 10, default: "active" })
  status!: "active" | "inactive";

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
