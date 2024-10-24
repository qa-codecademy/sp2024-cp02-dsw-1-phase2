import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class NoSensitiveUserInfoResponseDto {
  @Expose()
  @ApiResponseProperty({
    type: String,
    example: '0ff3e9c2-ec93-4735-a1da-50c834a78ffc',
  })
  id: string;

  @Expose()
  @ApiResponseProperty({
    type: String,
    example: 'Marija',
  })
  firstName: string;

  @Expose()
  @ApiResponseProperty({
    type: String,
    example: 'Menchevska',
  })
  lastName: string;

  @Expose()
  @ApiResponseProperty({
    type: String,
    example: '+3891234578',
  })
  phone: string;

  @Expose()
  @ApiResponseProperty({
    type: String,
    example: 'Partizanska, bb',
  })
  address: string;

  @Expose()
  @ApiResponseProperty({
    type: String,
    example: 'Skopje',
  })
  city: string;

  @Expose()
  @ApiResponseProperty({
    type: Number,
    example: 1000,
  })
  postalCode: number;

  @Expose()
  @ApiResponseProperty({
    type: String,
    example: 'Macedonia',
  })
  country: string;
}
