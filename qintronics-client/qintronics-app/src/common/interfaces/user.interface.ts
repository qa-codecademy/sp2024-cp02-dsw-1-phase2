import { Role } from "../enums/roles.enum";

export interface User {
  firstName: string;
  userId: string;
  email: string;
  role: Role;
}
