import { ApiResponseProperty } from '@nestjs/swagger';
import { Role } from 'src/common/enums/roles.enum';

export class LoginRefreshResponseDto {
  @ApiResponseProperty({
    type: String,
    example: 'd518236c-1f1e-49f1-b16b-ec14a06305e3',
  })
  userId: string;

  @ApiResponseProperty({
    type: String,
    example: 'marija@gmail.com',
  })
  email: string;

  @ApiResponseProperty({
    enum: Role,
    example: Role.Customer,
  })
  role: Role;

  @ApiResponseProperty({
    type: String,
    example: 'Marija',
  })
  firstName: string;

  accessToken: string;
  refreshToken: string;
}
