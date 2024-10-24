import { User } from 'src/users/user.entity';

export interface IRefreshToken {
  refreshToken: string;
  expDate: Date;
  user: User;
}
