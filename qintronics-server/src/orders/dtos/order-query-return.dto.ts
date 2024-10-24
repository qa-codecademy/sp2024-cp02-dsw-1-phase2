import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { BasicUserResponse } from 'src/users/dtos/basic-user-response.dto';
import {
  OrderReturnDto,
  ProductsAndQuantityReturnDto,
} from './order-return.dto';

export class QueryOrderReturnDto extends OrderReturnDto {
  @Expose()
  @Type(() => BasicUserResponse)
  @ApiProperty({
    type: BasicUserResponse,
    description: 'User who made the order',
  })
  user: BasicUserResponse;

  @Expose()
  @Type(() => ProductsAndQuantityReturnDto)
  productsAndQuantity: ProductsAndQuantityReturnDto[];
}
