import { Expose, Type } from 'class-transformer';
import { UserInfoProfileResponse } from 'src/user-info/dtos/user-info-profile-response.dto';
import { NoSensitiveUserResponse } from './no-sensitive-user-response.dto';

export class UserProfileResponse extends NoSensitiveUserResponse {
  @Expose()
  @Type(() => UserInfoProfileResponse)
  userInfo: UserInfoProfileResponse;
}
