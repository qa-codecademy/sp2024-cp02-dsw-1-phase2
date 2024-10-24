import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class MonthlyTotalHistoryDto {
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
  total_sum: number;
}
