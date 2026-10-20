import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ColorCategory } from '../enums/color-category';
import { TypeCategory } from '../enums/type-category';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsEnum(TypeCategory)
  type?: TypeCategory;

  @IsOptional()
  @IsEnum(ColorCategory)
  color?: ColorCategory;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  icon?: string;
}