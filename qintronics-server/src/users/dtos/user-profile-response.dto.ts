import { Expose, Type } from 'class-transformer';
import { UserInfoProfileResponseDto } from 'src/user-info/dtos/user-info-profile-response.dto';
import { NoSensitiveUserResponseDto } from './no-sensitive-user-response.dto';
import { ApiResponseProperty } from '@nestjs/swagger';

export class UserProfileResponseDto extends NoSensitiveUserResponseDto {
  @Expose()
  @Type(() => UserInfoProfileResponseDto)
  @ApiResponseProperty({
    type: UserInfoProfileResponseDto,
  })
  userInfo: UserInfoProfileResponseDto;
}
