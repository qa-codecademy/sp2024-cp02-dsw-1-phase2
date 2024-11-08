import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { StatusUpdateDto } from './status-update.dto';

export class OrderUpdateDto extends StatusUpdateDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'Email of the order',
    example: 'john.doe@gmail.com',
    maxLength: 255,
    minLength: 1,
  })
  email?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'First name of the recepient',
    example: 'John',
    maxLength: 255,
    minLength: 1,
  })
  firstName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'Last name of the recepient',
    example: 'Doe',
    maxLength: 255,
    minLength: 1,
  })
  lastName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'Phone number of the recipient',
    example: '+38977777777',
    maxLength: 15,
    minLength: 1,
  })
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'Street address and home number of the order',
    example: 'Partizanska 1',
  })
  address?: string;
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'Order address city',
    example: 'Skopje',
  })
  city?: string;
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'Order address zip code',
    example: 1000,
  })
  zip?: number;
  @IsDateString()
  @IsOptional()
  @ApiProperty({
    type: Date,
    description: 'Preferred date of delivery',
    example: '2024-09-30',
  })
  prefDeliveryDate?: string;
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    type: Boolean,
    description:
      'Order Payment Status, true if the order is paid online, false if cash on delivery',
    example: true,
  })
  isPaid?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    type: Boolean,
    description:
      'Order Canceling Status, true if order is canceled, can be canceled by the user or the admin',
    example: true,
  })
  isCanceled?: boolean;
}
