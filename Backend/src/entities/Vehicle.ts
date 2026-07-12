import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "vehicles" })
export class Vehicle {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "registration_number", type: "varchar", length: 50, unique: true })
  registrationNumber!: string;

  @Column({ name: "name_model", type: "varchar", length: 150 })
  nameModel!: string;

  @Column({ type: "varchar", length: 100 })
  type!: string;

  @Column({ name: "max_load_capacity", type: "decimal", precision: 10, scale: 2 })
  maxLoadCapacity!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  odometer!: number;

  @Column({ name: "acquisition_cost", type: "decimal", precision: 12, scale: 2 })
  acquisitionCost!: number;

  @Column({ type: "varchar", length: 100, nullable: true })
  region!: string;

  @Column({ type: "varchar", length: 10, default: "active" })
  status!: "active" | "inactive";

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
