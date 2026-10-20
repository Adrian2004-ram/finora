import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { Category } from '../../category/entities/category.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    length: 100,
  })
  name!: string;

  @Column({
    length: 255,
    unique: true,
  })
  email!: string;

  @Column({
    length: 255
  })
  passwordHash!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER
  })
  role!: UserRole;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  initialBalance!: number;
  
  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  currentBalance!: number;

  @Column({
    default: false,
  })
  emailVerified!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions!: Transaction[];

  @OneToMany(() => Category, (category) => category.user)
  categories!: Category[];
}
