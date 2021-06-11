export interface MUpdateUserRole {
  userId: number;
  avatar: File;
  firstName: string;
  lastName: string;
  contactNo: string;
  password: string;
  roleName: string;
  roleIds: number[];
  hasEdit: boolean;
  username: string;
  packer: boolean;
  deliver: boolean;
}
