import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

class OrdersHistoryDto {
  @IsString()
  @ApiProperty({
    type: 'string',
    description: 'The month in question',
    example: 'YYYY-MM',
  })
  month: string;

  @IsNumber()
  @ApiProperty({
    type: 'number',
    description: 'The totals for that month',
    example: 3999,
  })
  totalSum: number;

  @IsNumber()
  @ApiProperty({
    type: 'number',
    description: 'The total number of new customers for that month',
    example: 150,
  })
  totalOrdersNumber: number;

  @IsNumber()
  @ApiProperty({
    type: 'number',
    description: 'The average order value for that month',
    example: 3999,
  })
  averageOrderValue: number;
}

class UsersHistoryDto {
  @IsString()
  @ApiProperty({
    type: 'string',
    description: 'The month in question',
    example: 'YYYY-MM',
  })
  month: string;

  @IsNumber()
  @ApiProperty({
    type: 'number',
    description: 'The number of new customers for that month',
    example: 150,
  })
  newCustomers: number;
}

export class MonthlyTotalsDto {
  orderTotals: OrdersHistoryDto[];
  userTotals: UsersHistoryDto[];
}
