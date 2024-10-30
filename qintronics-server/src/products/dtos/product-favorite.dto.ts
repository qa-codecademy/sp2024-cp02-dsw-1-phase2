import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ProductFavoriteDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Product ID.',
    example: '2bedc084-8367-43eb-845c-e950491d01ad',
  })
  productId: string;
}