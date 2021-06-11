import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastService } from 'src/app/toast/toast-service';
import { UserRolesViewModel } from '../../view-model/user-roles-view-model';
import { MUpdateUserRole } from './dto/model/m-update-user-role';
import { IPermissions } from './dto/interface/i-permissions';
import { SortingPipe } from 'src/app/shared/pipe/sorting.pipe';
import { EndPoint } from 'src/app/security/end-point';
@Component({
  selector: 'app-edit-user-role',
  templateUrl: './edit-user-role.component.html',
  styleUrls: ['./edit-user-role.component.scss'],
})
export class EditUserRoleComponent implements OnInit {
  subscription: Subscription[] = [];

  updataModel: MUpdateUserRole = {
    userId: 0,
    avatar: null,
    firstName: '',
    lastName: '',
    contactNo: '',
    password: '',
    roleName: '',
    roleIds: [],
    hasEdit: false,
    username: '',
    packer: false,
    deliver: false
  };
  //for img
  fileToUpload: File = null;
  imagePath;
  imgURL: any;
  message: string;
  selectAll = false;
  hidenPassword = true;
  baseUrl = EndPoint.MainUri + 'files/';
  loadEditImgUrl: string;
  mapIds: number[] = [];
  Permissions: IPermissions = {
    selectAll: false,
    groupRoles: [
      {
        groupId: 10,
        groupName: 'Store',
        groupSelect: false,
        roles: [
          { id: 13, name: 'Products', select: false },
          { id: 15, name: 'Categories', select: false },
          { id: 36, name: 'Banners', select: false },
          { id: 18, name: 'POS', select: false },
          { id: 16, name: 'Invoice', select: false },
          { id: 17, name: 'Customers', select: false },
          { id: 1000, name: 'After Sale', select: false },
          { id: 23, name: 'Delivery', select: false },
          { id: 41, name: 'Shift Report', select: false },


          // { id: 45, name: 'Inventory', select: false },
        ],
      },

      {
        groupId: 4,
        groupName: 'Purchasing',
        groupSelect: false,
        roles: [
          { id: 5, name: 'Orders', select: false },
          { id: 12, name: 'Shipment', select: false },
          { id: 44, name: 'Values Setting', select: false },
          { id: 7, name: 'Vendors', select: false },
          { id: 6, name: 'Exchange Rates', select: false },
        ],
      },

      {
        groupId: 3,
        groupName: 'Warehouse',
        groupSelect: false,
        roles: [
          { id: 1001, name: 'Stock Management', select: false },
          { id: 9, name: 'Stock-in', select: false },
          { id: 11, name: 'Picking', select: false },
          { id: 22, name: 'Barcode Manager', select: false },
        ],
      },



      {
        groupId: 39,
        groupName: 'Report',
        groupSelect: false,
        roles: [
          { id: 40, name: 'Sales Report', select: false },

        ],
      },

    ],
  };

  constructor(
    public vmUserRoles: UserRolesViewModel,
    private toast: ToastService,
    public sorting: SortingPipe
  ) { }

  ngOnInit(): void {
    this.vmUserRoles.setCheckbox(this.Permissions); // set all permissions to view model
    this.setEditData();//load data in table to edit form
  }

  setEditData(): void {
    this.updataModel.userId = this.vmUserRoles.editUserRole.userId;
    this.updataModel.firstName = this.vmUserRoles.editUserRole.firstName;
    this.updataModel.lastName = this.vmUserRoles.editUserRole.lastName;
    this.updataModel.roleName = this.vmUserRoles.editUserRole.role;
    this.updataModel.roleIds = this.vmUserRoles.editUserRole.roleIds;
    this.updataModel.username = this.vmUserRoles.editUserRole.username;
    this.loadEditImgUrl = this.vmUserRoles.editUserRole.avatar;
    this.updataModel.contactNo = this.vmUserRoles.editUserRole.contactNo;
    this.loadRoleBox(this.updataModel.roleIds);
    this.updataModel.packer = (this.vmUserRoles.editUserRole.roleIds.filter(f => f === 43).length > 0) ? true : false;
    this.updataModel.deliver = (this.vmUserRoles.editUserRole.roleIds.filter(f => f === 42).length > 0) ? true : false;
  }

  loadRoleBox(roleids: number[]) { // load checkbox role
    // update groupid
    this.vmUserRoles.roleCheckBox.groupRoles
      .filter((gid) => roleids.includes(gid.groupId))
      .forEach((gidUp) => (gidUp.groupSelect = true));
    // update roles
    this.vmUserRoles.roleCheckBox.groupRoles.forEach((g) =>
      g.roles
        .filter((rid) => roleids.includes(rid.id))
        .forEach((ridUp) => (ridUp.select = true))
    );
    if (roleids.filter(f => f !== 100 && f !== 101).length === 31) {
      this.vmUserRoles.roleCheckBox.selectAll = true;
      this.updataModel.packer = true;
      this.updataModel.deliver = true;
    }
  }

  mapRoleIds(): number[] { // after check box map only id
    let mapIds: number[] = [];
    if (this.Permissions.selectAll === true) {
      const data = [
        3,4,5,6,7,9,10,11,12,13,14,15,16,17,18,22,23,36,37,38,39,40,41,44
      ];

      mapIds = []

      data.forEach((itx) => {
        mapIds.push(itx);
      });
    } else {
      const mainRole = this.Permissions.groupRoles.filter(
        (f) => f.groupSelect === true
      );
      mainRole
        .map((m) => m.groupId)
        .forEach((itx) => {
          mapIds.push(itx);
        });

      for (
        let index = 0;
        index < mainRole.map((m3) => m3.roles).length;
        index++
      ) {
        const subRole = mainRole.map((m3) => m3.roles)[index];
        const subId = subRole
          .filter((f3) => f3.select === true)
          .map((m4) => m4.id);
        subId.forEach((subId) => {
          mapIds.push(subId);
        });
      }
    }

    return mapIds;
  }

  pushSubPage(): void {
    if (this.mapRoleIds().find(f => f === 17)) {
      const subCustomer = [19, 20, 21];
      subCustomer.forEach(c => {
        this.mapIds.push(c);
      })
    }

    if (this.mapRoleIds().find(f => f === 23)) {
      const subDiliverli = [24, 25, 26, 27, 30, 31];
      subDiliverli.forEach(c => {
        this.mapIds.push(c);
      })
    }

    if (this.mapRoleIds().find(b => b === 36)) {
      const subBand = [37, 38];
      subBand.forEach(b => {
        this.mapIds.push(b);
      })
    }

  }

  getPacker() {
    if (this.updataModel.packer === true) {
      this.mapIds.push(43);
    }

    if (this.updataModel.deliver === true) {
      this.mapIds.push(42)
    }
  }

  editUserRoleSubmit(model: MUpdateUserRole): void {

    if (this.updataModel.hasEdit === true) {

      if (model.firstName.length < 5) {
        alert('First name length must be 5 characters.');
        return;
      }

      if (model.lastName.length < 5) {
        alert('Last name length must be 5 characters.');
        return;
      }

      if (model.contactNo.length < 5) {
        alert('Contact number length must be 5 characters.');
        return;
      }

      if (model.roleName.length < 5) {
        alert('Role length must be 5 characters.');
        return;
      }

      if (model.username.length < 8) {
        alert('User name length must be 8 characters.');
        return;
      }

      if (model.password.length > 0 && model.password.length < 8) {
        alert('Password length must be 8 characters.');
        return;
      }



      this.getPacker();

      if (this.updataModel.packer === false && this.updataModel.deliver === false) {
        if (this.mapRoleIds().length === 0) {
          alert('Please select role');
          return;
        }
      }

      this.pushSubPage();

      this.mapRoleIds().forEach(itx => {
        if (itx !== 100) {
          this.mapIds.push(itx);
        }
      });

      this.toast.doToast();
      const addNewModel = new FormData();
      addNewModel.append('file', this.fileToUpload);
      addNewModel.append('firstName', model.firstName.trim());
      addNewModel.append('lastName', model.lastName.trim());
      addNewModel.append('password', model.password.trim());
      addNewModel.append('roleName', model.roleName.trim());
      addNewModel.append('roleIds', this.mapIds.toString());
      addNewModel.append('contactNo',model.contactNo.trim());
      addNewModel.append('userId',model.userId.toString());

      const addModel = this.vmUserRoles.editUserRoleSubmit(addNewModel).subscribe(
        (res) => {
          if (res > 0) {
            this.updateAfterEdit();
            alert('Edit User Role Complete');
            this.toast.closeToast();
          } else if(res === -1) {
            alert('The user name has exist...!');
            this.toast.closeToast();
          }else{
            alert('Please type again !');
            this.toast.closeToast()
          }
        },
        (err) => console.log(err),
        () => {
          this.subscription.push(addModel);
          this.toast.closeToast();
          this.closeFunc();
        }
      );
    }
  }

  updateAfterEdit(): void {
    const findItem = this.vmUserRoles.userRoleList.find(
      (f) => f.userId == this.updataModel.userId
    );
    const deleteItem = this.vmUserRoles.userRoleList.indexOf(findItem);
    this.vmUserRoles.userRoleList.splice(deleteItem, 1);
    findItem.userId = this.updataModel.userId;
    findItem.firstName = this.updataModel.firstName;
    findItem.role = this.updataModel.roleName;
    findItem.roleIds = this.mapRoleIds();
    this.vmUserRoles.userRoleList.push(findItem);
    const newList = this.sorting.transform(this.vmUserRoles.userRoleList, 'userId').reverse();
    this.vmUserRoles.setUserRoleList(newList);

    this.closeFunc();
  }

  closeFunc(): void {
    this.vmUserRoles.editModel = false;
    const reset: MUpdateUserRole = {
      userId: 0,
      avatar: null,
      firstName: '',
      lastName: '',
      password: '',
      roleName: '',
      roleIds: [],
      hasEdit: false,
      username: '',
      packer: false,
      deliver: false,
      contactNo: ''
    };
    this.updataModel = reset;
    this.loadEditImgUrl = '';
    this.imgURL = '';
    this.mapIds = [];

    this.vmUserRoles.updateUserRoleList();
  }
  //for img
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.preview(this.fileToUpload);
  }

  preview(files) {
    if (files.length === 0) return;

    var mimeType = files.type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = 'Only images are supported.';
      return;
    }
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };

    if (files) {
      this.loadEditImgUrl = '';
    }
  }
  //end img

  selectAllFunc(roles: IPermissions) {
    if (roles.selectAll === true) {
      this.updataModel.packer = false;
      this.updataModel.deliver = false;
      roles.groupRoles.forEach((itx) => {
        itx.groupSelect = false;
        itx.roles.forEach((sub) => {
          sub.select = false;
        });
      });
    } else {
      this.updataModel.packer = true;
      this.updataModel.deliver = true;
      roles.groupRoles.forEach((itx) => {
        itx.groupSelect = true;
        itx.roles.forEach((sub) => {
          sub.select = true;
        });
      });
    }
  }

  clcikCheckBox(): void {
    if (this.Permissions.groupRoles.find((f) => f.groupSelect === false)) {
      this.vmUserRoles.roleCheckBox.selectAll = false;
    }
    if (
      this.Permissions.groupRoles
        .map((m) => m.roles)[0]
        .find((f2) => f2.select === false)
    ) {
      this.vmUserRoles.roleCheckBox.selectAll = false;
    }
  }

  checkChildren(id: number): void {
    const main = this.Permissions.groupRoles.find(f => f.groupId === id);
    main.roles.forEach(role => role.select = false);
  }
}
