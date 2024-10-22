import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BasicUserInfoResponse {
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
}
