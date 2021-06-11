import { Injectable } from '@angular/core';
import { IRefRoles } from '../dto/interface/i-ref-roles';
import { IUsers } from '../dto/interface/i-users';

@Injectable()
export class PermissionService {
  activePage = 0;
  userList: IUsers[] =[];
  editUserModel: IUsers;
  userRoleList :IRefRoles[] =[];

  constructor() { }

  //#region  userList
    setUserList(ul:IUsers[]): void{
      this.userList = ul;
    }

    setRoleList(roleList: IRefRoles[]){
      this.userRoleList = roleList;
    }
  //#endregion


}
