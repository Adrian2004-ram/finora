import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req: { user: AuthenticatedUser },
  ) {
    return this.categoryService.create(createCategoryDto, req.user.userId);
  }

  @Get()
  findAll(@Req() req: { user: AuthenticatedUser }) {
    return this.categoryService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: { user: AuthenticatedUser }) {
    return this.categoryService.findById(id, req.user.userId);
  }

  @Patch(':id')
  editar(
    @Param('id') id: string,
    @Req() req: { user: AuthenticatedUser },
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoryService.editar(id, req.user.userId, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: { user: AuthenticatedUser }) {
    return this.categoryService.delete(id, req.user.userId);
  }
}
