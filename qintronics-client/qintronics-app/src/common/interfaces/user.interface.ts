import { Role } from "../enums/roles.enum";

export interface User {
  userId: string;
  email: string;
  role: Role;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
