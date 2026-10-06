import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Post()
    create(@Body() createUserDto: CreateUserDTO) {
        return this.usersService.createUser(createUserDto);
    }

}
