import { IUserPage } from "./i-user-page";
import { IRefRoles } from "./i-ref-roles";

export interface IUsers {
  userId: number;
  avatar: string;
  firstName : string;
  lastName: string;
  role: string;
  userName: string;
  password: string;
  contactNo: string;
  userRoles : IRefRoles[];
  userPages : IUserPage[];
}
