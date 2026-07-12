import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Vehicle } from "./Vehicle";

@Entity({ name: "expenses" })
export class Expense {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "vehicle_id", type: "int" })
  vehicleId!: number;

  @ManyToOne(() => Vehicle, { eager: true })
  @JoinColumn({ name: "vehicle_id" })
  vehicle!: Vehicle;

  @Column({ type: "varchar", length: 100 })
  type!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: "date" })
  date!: string;

  @Column({ type: "varchar", length: 10, default: "active" })
  status!: "active" | "inactive";

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
