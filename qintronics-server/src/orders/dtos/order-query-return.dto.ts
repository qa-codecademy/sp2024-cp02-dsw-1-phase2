import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import {
  OrderReturnDto,
  ProductsAndQuantityReturnDto,
} from './order-return.dto';
import { PageMetaDto } from 'src/common/pagination/page-meta.dto';
import { NoSensitiveUserResponseDto } from 'src/users/dtos/no-sensitive-user-response.dto';
export class QueryOrderReturnDto extends OrderReturnDto {
  @Expose()
  @Type(() => NoSensitiveUserResponseDto)
  @ApiProperty({
    type: NoSensitiveUserResponseDto,
    description: 'User who made the order',
  })
  user: NoSensitiveUserResponseDto;

  @Expose()
  @Type(() => ProductsAndQuantityReturnDto)
  productsAndQuantity: ProductsAndQuantityReturnDto[];
}

export class SwaggerOrderReturnDto {
  @ApiProperty({
    type: [QueryOrderReturnDto],
    description: 'Orders successfully retrieved',
  })
  data: QueryOrderReturnDto[];
  @ApiProperty({ type: () => PageMetaDto })
  meta: PageMetaDto;
}
