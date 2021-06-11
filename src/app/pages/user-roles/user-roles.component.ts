import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IUserRoles } from './dto/interface/i-user-roles';
import { MRoleUpdate } from './dto/model/m-role-update';
import { UserRolesViewModel } from './view-model/user-roles-view-model';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss'],
})
export class UserRolesComponent implements OnInit, OnDestroy {
  subscription: Subscription[] = [];
  searchValue: string;
  userPos = 0;

  constructor(public vmUserRoles: UserRolesViewModel) {}

  ngOnInit(): void {
    const userRoleSub = this.vmUserRoles.getUserRole().subscribe(
      (res) => {
        this.vmUserRoles.setUserRoleList(res);
      },
      (err) => console.log(err),
      () => {
        this.subscription.push(userRoleSub);
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.forEach((s) => {
      s.unsubscribe();
    });
  }

  searchUserRole(): void {
    if (this.searchValue !== '') {
      const searchSub = this.vmUserRoles
        .searchUserRole(this.searchValue)
        .subscribe(
          (res) => {
            this.vmUserRoles.setUserRoleList(res);
          },
          (err) => console.log(err),
          () => {
            this.subscription.push(searchSub);
          }
        );
    } else {
      const userRoleSub = this.vmUserRoles.getUserRole().subscribe(
        (res) => {
          this.vmUserRoles.setUserRoleList(res);
        },
        (err) => console.log(err),
        () => {
          this.subscription.push(userRoleSub);
        }
      );
    }
  }

  getItemsCount(): number {
    return this.vmUserRoles.userRoleList.length;
  }

  posEventEmmit($event: any): void {
    this.userPos = $event;
  }

  userRoleList(): IUserRoles[] {
    const copyItems: IUserRoles[] = Object.assign(
      [],
      this.vmUserRoles.userRoleList
    );

    if (copyItems.length > 20) {
      return copyItems.splice(this.userPos * 20, 20);
    } else {
      return copyItems;
    }
  }

  detailSubmit(userrole: MRoleUpdate): void {
    this.vmUserRoles.editModel = true;
    this.vmUserRoles.setUserEdit(userrole);
    this.setBand(userrole);

  }

  setBand(list:MRoleUpdate):void{
    if(list.roleIds.find(f => f === 36)){
     const ids =[100, 101];
     ids.forEach(f => {
      this.vmUserRoles.editUserRole.roleIds.push(f);
     })

    }
  }
}
