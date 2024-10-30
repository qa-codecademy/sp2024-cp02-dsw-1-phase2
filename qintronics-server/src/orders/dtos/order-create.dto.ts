import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

// * Class needed for the Order and Product Relation
export class ProductsAndQuantity {
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'The UUID of the product',
    example: '2a7dc9f8-40ca-4d0e-a897-2f6a55ccbd88',
  })
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: 'number',
    description: 'The quantity of the product',
    example: 2,
  })
  quantity: number;
}

export class OrderCreateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Email of the order',
    example: 'john.doe@gmail.com',
    maxLength: 255,
    minLength: 1,
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'First name of the recepient',
    example: 'John',
    maxLength: 255,
    minLength: 1,
  })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Last name of the recepient',
    example: 'Doe',
    maxLength: 255,
    minLength: 1,
  })
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Phone number of the recipient',
    example: '+38977777777',
    maxLength: 15,
    minLength: 1,
  })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Street address and home number of the order',
    example: 'Partizanska 1',
  })
  address: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Order address city',
    example: 'Skopje',
  })
  city: string;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    description: 'Order address zip number',
    example: 1000,
  })
  zip: number;
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    type: Date,
    description: 'Preferred delivery date of the order',
    example: '2024-09-30',
  })
  prefDeliveryDate: string;
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    type: Boolean,
    description:
      'Order Payment Status, true if the order is paid online, false if cash on delivery',
    example: true,
  })
  isPaid: boolean;
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: [ProductsAndQuantity],
    description: 'List of product IDs in UUID format alongside their quantity',
    example: [
      { productId: '2a7dc9f8-40ca-4d0e-a897-2f6a55ccbd88', quantity: 2 },
    ],
  })
  productsAndQuantity: ProductsAndQuantity[];
}
