import { User } from 'src/users/user.entity';

export interface IResetPasswordToken {
  resetPasswordToken: string;
  expDate: Date;
  user: User;
}
