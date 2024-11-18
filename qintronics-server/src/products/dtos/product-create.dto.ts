import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ProductCreateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Product name.',
    example: 'Lenovo ThinkPad X1 Carbon Gen 9',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Product brand.',
    example: 'Lenovo',
  })
  brand: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Product description.',
    example: 'Ultra-lightweight business laptop with powerful performance.',
  })
  description: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'Product image.',
    example: '/images/laptops/lenovo-1.jpg',
  })
  img?: string;

  // @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Product specifications.',
    example: {
      cpu: 'Intel Core i7-1165G7',
      gpu: 'Intel Iris Xe',
      ram: '16GB',
      storage: '512GB SSD',
      display: '14 FHD',
      camera: '720p HD',
      battery: 'Up to 15 hours',
      os: 'Windows 10 Pro',
    },
  })
  specifications: any;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({
    type: Number,
    description: 'Product price.',
    example: 1499,
  })
  price: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Product warranty.',
    example: '3 years',
  })
  warranty: string;

  // @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    description: 'Product availability.',
    example: 20,
  })
  availability: number;

  // @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    description: 'Product discount.',
    example: 10,
  })
  discount: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Product category.',
    example: '0ff3e9c2-ec93-4735-a1da-50c834a78ffc',
  })
  categoryId: string;
}
