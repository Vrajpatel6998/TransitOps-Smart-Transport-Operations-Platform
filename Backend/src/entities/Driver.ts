import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "drivers" })
export class Driver {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 150 })
  name!: string;

  @Column({ name: "license_number", type: "varchar", length: 50, unique: true })
  licenseNumber!: string;

  @Column({ name: "license_category", type: "varchar", length: 50 })
  licenseCategory!: string;

  @Column({ name: "license_expiry_date", type: "date" })
  licenseExpiryDate!: string;

  @Column({ name: "contact_number", type: "varchar", length: 50 })
  contactNumber!: string;

  @Column({ name: "safety_score", type: "decimal", precision: 5, scale: 2, default: 100.00 })
  safetyScore!: number;

  @Column({ type: "varchar", length: 10, default: "active" })
  status!: "active" | "inactive";

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
