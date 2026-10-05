import { User } from '../entities/user.entity';
import { UserRole } from '../enums/user-role.enum';

export class UserResponseDTO {
  id!: string;

  name!: string;

  email!: string;

  role!: UserRole;

  initialBalance!: number;

  currentBalance!: number;

  emailVerified!: boolean;

  createdAt!: Date;

  updatedAt!: Date;

  constructor(user: User) {
 this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
    this.initialBalance = user.initialBalance;
    this.currentBalance = user.currentBalance;
    this.emailVerified = user.emailVerified;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
