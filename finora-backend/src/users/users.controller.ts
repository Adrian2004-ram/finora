import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {       
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMe(@Req() req: { user: AuthenticatedUser }) {
    return this.usersService.findById(req.user.userId);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDTO) {
    return this.usersService.createUser(createUserDto);
  }

}
