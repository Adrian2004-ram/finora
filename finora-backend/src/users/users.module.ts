import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Category } from '../category/entities/category.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Category])
    ],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {W}
