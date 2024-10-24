import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../product.entity';

export class ProductResponseDto {
  @ApiProperty({
    description: 'List of products',
    type: [Product],
  })
  products: Product[];

  @ApiProperty({
    description: 'Total number of products',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Indicates if there is a next page of products',
    example: true,
  })
  next: boolean;

  @ApiProperty({
    description: 'Indicates if there is a previous page of products',
    example: false,
  })
  prev: boolean;
}
