export interface IPermissions {
  selectAll: boolean;
  groupRoles: {
    groupId: number;
    groupName: string;
    groupSelect: boolean;
    roles: {
      id: number;
      name: string;
      select: boolean;
    }[];
  }[];
}
