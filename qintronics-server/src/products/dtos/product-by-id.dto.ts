import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class getProductByIdQueryDto {
  @ApiProperty({
    type: String,
    description: 'Product ID',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiPropertyOptional({
    type: String,
    description: 'User ID',
  })
  @IsString()
  @IsOptional()
  userId?: string;
}
