import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CategoryCreateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Category name.',
    example: 'Laptops',
  })
  name: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Section ID.',
    example: '0ff3e9c2-ec93-4735-a1da-50c834a78ffc',
  })
  sectionId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'Category icon URL.',
    example: './images/laptops.png',
  })
  iconURL: string;
}
