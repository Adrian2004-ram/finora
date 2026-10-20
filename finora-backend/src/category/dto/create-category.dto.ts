import { IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ColorCategory } from '../enums/color-category';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsEnum(ColorCategory)
  @IsNotEmpty()
  color!: ColorCategory;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  icon!: string;
}