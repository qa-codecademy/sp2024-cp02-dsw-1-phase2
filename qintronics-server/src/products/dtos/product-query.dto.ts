import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsOptional, IsString } from 'class-validator';

export class ProductQueryDto {
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  discount?: boolean;

  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  categoryName?: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  pageSize?: number = 10;

  @IsString()
  @IsOptional()
  @IsIn(['name', 'price'])
  sortBy?: string;

  @IsString()
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sort?: 'ASC' | 'DESC';
}
