import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { NoSensitiveUserInfoResponseDto } from './no-sensitive-user-info-response.dto';

export class UserInfoProfileResponseDto extends NoSensitiveUserInfoResponseDto {
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

  @Expose()
  @ApiResponseProperty({
    type: String,
    example: '************2345',
  })
  ccNum: string;

  @Expose()
  @ApiResponseProperty({
    type: Date,
    example: '2024-05-01 00:00:00',
  })
  expDate: Date;

  @Expose()
  @ApiResponseProperty({
    type: String,
    example: 'John Doe',
  })
  ccFullName: string;
}
