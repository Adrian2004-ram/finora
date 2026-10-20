import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository, DataSource } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CategoryResponseDto } from './dto/category-response.dto';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { ColorCategory } from './enums/color-category';
import { TypeCategory } from './enums/type-category';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    userId: string,
  ): Promise<CategoryResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      const categoryRepository = manager.getRepository(Category);
      const userRepository = manager.getRepository(User);

      const user = await userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      const category = categoryRepository.create({
        name: createCategoryDto.name,
        type: createCategoryDto.type,
        color: createCategoryDto.color,
        icon: createCategoryDto.icon,
        user,
      });

      const savedCategory = await categoryRepository.save(category);

      return this.toDto(savedCategory);
    });
  }

  async findAll(userId: string): Promise<CategoryResponseDto[]> {
    const categorias = await this.categoryRepository.find({
      where: { user: { id: userId } },
    });
    return categorias.map((categoria) => this.toDto(categoria));
  }

  async findById(id: string, userId: string): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
        user: { id: userId },
      },
    });

    if (!category) {
      throw new NotFoundException('Categoria no encontrada');
    }

    return this.toDto(category);
  }

  async editar(
    id: string,
    userId: string,
    dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      const userRepository = manager.getRepository(User);
      const categoryRepository = manager.getRepository(Category);

      const user = await userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      const category = await categoryRepository.findOne({
        where: {
          id,
          user: {
            id: userId,
          },
        },
      });

      if (!category) {
        throw new NotFoundException('Categoria no encontrada');
      }

      if (category.isSystem) {
        throw new ForbiddenException(
          'No se puede modificar una categoría del sistema.',
        );
      }

      Object.assign(category, dto);

      const categorySaved = await categoryRepository.save(category);

      return this.toDto(categorySaved);
    });
  }

  async delete(id: string, userId: string) {
    await this.dataSource.transaction(async (manager) => {
      const categoryRepository = manager.getRepository(Category);
      const transactionRepository = manager.getRepository(Transaction);

      const category = await categoryRepository.findOne({
        where: { id, user: { id: userId } },
      });

      if (!category) {
        throw new NotFoundException('Categoria no encontrada');
      }

      if (category.isSystem) {
        throw new ForbiddenException(
          'No se puede eliminar una categoría del sistema.',
        );
      }

      const defaultIncomeCategory = await this.ensureDefaultCategory(
        manager,
        userId,
      );

      await transactionRepository.update(
        { category: { id: category.id } },
        { category: defaultIncomeCategory },
      );

      await categoryRepository.delete(id);
    });
  }

  async ensureDefaultCategory(
    manager: import('typeorm').EntityManager,
    userId: string,
  ): Promise<Category> {
    const categoryRepository = manager.getRepository(Category);
    const existingCategory = await categoryRepository.findOne({
      where: {
        name: 'Sin categoria',
        type: TypeCategory.NO_CATEGORY,
        isSystem: true,
        user: { id: userId },
      },
    });

    if (existingCategory) {
      return existingCategory;
    }

    const user = await manager.getRepository(User).findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return categoryRepository.save(
      categoryRepository.create({
        name: 'Sin categoria',
        type: TypeCategory.NO_CATEGORY,
        color: ColorCategory.GRIS,
        icon: 'folder',
        isSystem: true,
        user,
      }),
    );
  }

  private toDto(category: Category): CategoryResponseDto {
    return new CategoryResponseDto(category);
  }
}
