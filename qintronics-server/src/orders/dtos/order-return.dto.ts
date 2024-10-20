import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { Product } from 'src/products/product.entity';
import { NoSensitiveUserResponseDto } from 'src/users/dtos/no-sensitive-user-response.dto';

class ProductsAndQuantityReturnDto {
  @Expose()
  @ApiProperty({
    type: Product,
    description: 'The product details',
  })
  product: Product;

  @Expose()
  @ApiProperty({
    type: 'number',
    description: 'The quantity of the product',
    example: 2,
  })
  quantity: number;
}

export class OrderReturnDto {
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Order unique ID in UUID format',
    example: '7a7bc9f8-40da-4d0e-a897-3f7a55ccbd88',
  })
  id: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Street address and home number of the order',
    example: 'Partizanska 1',
  })
  address: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Order address city',
    example: 'Skopje',
  })
  city: string;

  @Expose()
  @ApiProperty({
    type: Number,
    description: 'Order address zip number',
    example: 1000,
  })
  zip: number;

  @Expose()
  @ApiProperty({
    type: Date,
    description: 'Preferred delivery date of the order',
    example: '2024-09-30',
  })
  prefDeliveryDate: string;

  @Expose()
  @ApiProperty({
    type: Boolean,
    description:
      'Order Payment Status, true if the order is paid online, false if cash on delivery',
    example: true,
  })
  isPaid: boolean;

  @Expose()
  @ApiProperty({
    type: Boolean,
    description:
      'Order Processing Status, true if order is processed and taken by the delivery service',
    example: true,
  })
  isTaken: boolean;

  @Expose()
  @ApiProperty({
    type: Boolean,
    description:
      'Order Delivery Status, true if the order is delivered, the order is then completed. Set by the delivery person',
    example: true,
  })
  isDelivered: boolean;

  @Expose()
  @ApiProperty({
    type: Boolean,
    description:
      'Order Canceling Status, true if order is canceled, can be canceled by the user or the admin',
    example: true,
  })
  isCanceled: boolean;

  @Expose()
  @ApiProperty({
    type: Number,
    description: 'Total price of the order',
    example: 1200,
  })
  total: number;

  @Expose()
  @Type(() => NoSensitiveUserResponseDto)
  @ApiProperty({
    type: NoSensitiveUserResponseDto,
    description: 'User who made the order',
  })
  user: NoSensitiveUserResponseDto;

  @Expose()
  @Type(() => ProductsAndQuantityReturnDto)
  @ApiProperty({
    type: [ProductsAndQuantityReturnDto],
    description: 'List of products with their quantities',
  })
  productsAndQuantity: ProductsAndQuantityReturnDto[];

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date | null;

  @Exclude()
  lastUpdatedBy: string | null;
}
