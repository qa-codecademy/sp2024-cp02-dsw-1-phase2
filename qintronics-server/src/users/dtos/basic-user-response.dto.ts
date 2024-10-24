import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Role } from 'src/common/enums/roles.enum';

export class BasicUserResponse {
  @Expose()
  @ApiResponseProperty({
    type: String,
    example: '0ff3e9c2-ec93-4735-a1da-50c834a78ffc',
  })
  id: string;

  @Expose()
  @ApiResponseProperty({
    type: String,
    example: 'marija@gmail.com',
  })
  email: string;

  @Expose()
  @ApiResponseProperty({
    enum: Role,
    example: Role.Customer,
  })
  role: Role;
}
