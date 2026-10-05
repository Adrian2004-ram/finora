import {
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserResponseDTO } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<UserResponseDTO[]> {
    const allUsers = await this.userRepository.find();
    return allUsers.map((user) => new UserResponseDTO(user));
  }

  async createUser(createUserDto: CreateUserDTO) {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'El email ya está registrado',
      );
    }

    const passwordHash = await bcrypt.hash(
      createUserDto.password,
      12,
    );

    const user = this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      passwordHash,
    });

    const saveUser = await this.userRepository.save(user);

    return new UserResponseDTO(saveUser);
  }
}