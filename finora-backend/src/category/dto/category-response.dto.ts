import { Category } from '../entities/category.entity';
import { ColorCategory } from '../enums/color-category';

export class CategoryResponseDto {
  id!: string;
  name!: string;
  color!: ColorCategory;
  icon!: string;
  isSystem!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(category: Category) {
    this.id = category.id;
    this.name = category.name;
    this.color = category.color;
    this.icon = category.icon;
    this.isSystem = Boolean(category.isSystem);
    this.createdAt = category.createdAt;
    this.updatedAt = category.updatedAt;
  }
}