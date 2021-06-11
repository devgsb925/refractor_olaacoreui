import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRolesApiService } from '../api/user-roles-api.service';
import { IUserRoles } from '../dto/interface/i-user-roles';
import { IPermissions } from '../components/edit-user-role/dto/interface/i-permissions';
import { MRoleUpdate } from '../dto/model/m-role-update';

@Injectable()
export class UserRolesViewModel {
  public userRoleList: IUserRoles[] = [];
  public editUserRole: MRoleUpdate;
  public addModal: boolean = false;
  public editModel: boolean = false;
  public userRoleId = 0;
  public roleCheckBox: IPermissions;

  constructor(private apiUSerRole: UserRolesApiService) {}

  updateUserRoleList(): void {
    this.apiUSerRole.getUserRole().subscribe((res) => {
      this.setUserRoleList(res);
    })
  }

  setUserRoleList(userList: IUserRoles[]): void {
    this.userRoleList = userList;
  }

  getUserRole(): Observable<IUserRoles[]> {
    return this.apiUSerRole.getUserRole();
  }

  searchUserRole(search: string): Observable<IUserRoles[]> {
    return this.apiUSerRole.searchUserRole(search);
  }

  addUserRole(model: FormData): Observable<number> {
    return this.apiUSerRole.addUserRole(model);
  }

  setUserEdit(ulist: MRoleUpdate): void {
    this.editUserRole = ulist;
  }

  editUserRoleSubmit(model: FormData): Observable<number> {
    return this.apiUSerRole.editUserRole(model);
  }

  setCheckbox(data: IPermissions): void {
    this.roleCheckBox = data;
  }
}
