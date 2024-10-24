import { ICurrentUser } from './current-user.interface';

export interface ILoginRefreshUser extends ICurrentUser {
  firstName: string;
}
