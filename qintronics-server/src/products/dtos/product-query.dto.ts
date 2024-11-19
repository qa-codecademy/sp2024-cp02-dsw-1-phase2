import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class ProductQueryDto {
  @ApiPropertyOptional({
    type: Boolean,
    description: 'Discounted Products',
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  discount?: boolean;

  @ApiPropertyOptional({
    type: String,
    description: 'Product Name',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Product Brand',
  })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Category Name',
  })
  @IsString()
  @IsOptional()
  categoryName?: string;

  @ApiPropertyOptional({
    type: Number,
    description: 'Page Number',
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    type: Number,
    description: 'Page Size',
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  pageSize?: number = 10;

  @ApiPropertyOptional({
    type: String,
    description: 'Sort By',
  })
  @IsString()
  @IsOptional()
  @IsIn(['name', 'price'])
  sortBy?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Sort order (ASC or DESC)',
  })
  @IsString()
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sort?: 'ASC' | 'DESC';

  @ApiPropertyOptional({
    type: String,
    description: 'User unique ID in UUID format',
  })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Random Products',
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  random?: boolean;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Include Gift Cards?',
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  includeGiftCards?: boolean;
}
