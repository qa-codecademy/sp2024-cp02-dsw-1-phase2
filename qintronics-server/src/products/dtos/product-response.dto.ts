import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Product } from '../product.entity';

export class FavoritedProducts extends Product {
  @ApiPropertyOptional({
    type: 'boolean',
    description: 'Indicates if the product is favorited by the user',
    example: false,
  })
  isFavorite?: boolean;
}

export class ProductResponseDto {
  @ApiProperty({
    description: 'List of products',
    type: [FavoritedProducts],
  })
  products: FavoritedProducts[];

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