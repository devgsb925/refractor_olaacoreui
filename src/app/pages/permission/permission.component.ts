import { Component, OnInit } from '@angular/core';
import { PermissionService } from './view-model/permission.service';
import { IUsers } from './dto/interface/i-users';
import { IRefRoles } from './dto/interface/i-ref-roles';


@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit {

  userPos = 0;
  constructor(
    public vmPermission : PermissionService,
  ) { }

  jsonData : IUsers[] = [
    {
      userId: 1,
      avatar: '../../../../../assets/user1.jpg',
      firstName : 'khamlar',
      lastName: 'chanthavong',
      role: 'addmin',
      userName: 'khamlar',
      password: '123456',
      contactNo: '02078387878',
      userRoles : [
        {
          roleId: 1,
          roleName: 'test1'
        },
        {
          roleId: 2,
          roleName: 'test2'
        }
      ],
      userPages : [
        {
          userPageId: 1,
          pageId: 1,
          roleName: 'admin',
          readExecute: true,
          writeExecute: true,
        }
      ]
    },
    {
      userId: 2,
      avatar: '../../../../../assets/user1.jpg',
      firstName : 'lar',
      lastName: 'chanthavong',
      role: '',
      userName: '',
      password: '',
      contactNo: '',
      userRoles : [
        {
          roleId: 1,
          roleName: 'test1'
        },
        {
          roleId: 2,
          roleName: 'test2'
        }
      ],
      userPages : [
        {
          userPageId: 1,
          pageId: 1,
          roleName: '',
          readExecute: true,
          writeExecute: false,
        }
      ]
    },

  ];

  roles: IRefRoles[] = [
    {
      roleId: 1,
      roleName: 'superadmin'
    },
    {
      roleId: 1,
      roleName: 'superadmin'
    },
    {
      roleId: 1,
      roleName: 'superadmin'
    },
    {
      roleId: 1,
      roleName: 'superadmin'
    }
  ]

  ngOnInit(): void {
      this.firstLoad();
  }

  firstLoad(): void{
    this.vmPermission.setUserList(this.jsonData);
  }

  changePageFunc(id: number):void{
    this.vmPermission.activePage = id;
  }

  getItemsCount(): number {
    return this.vmPermission.userList.length;
  }

  posEventEmmit($event: any): void {
    this.userPos = $event;
  }

  userRoleList(): IUsers[] {
    const copyItems: IUsers[] = Object.assign(
      [],
      this.vmPermission.userList
    );

    if (copyItems.length > 20) {
      return copyItems.splice(this.userPos * 20, 20);
    } else {
      return copyItems;
    }
  }

  editSubmit(userId: number):void{
    this.vmPermission.activePage = 2;
    this.vmPermission.editUserModel =  this.vmPermission.userList.find(f => f.userId === userId);
  }

}
