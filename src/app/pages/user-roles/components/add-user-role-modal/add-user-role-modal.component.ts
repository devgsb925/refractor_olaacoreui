import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToastService } from 'src/app/toast/toast-service';
import { IUserRoles } from '../../dto/interface/i-user-roles';
import { UserRolesViewModel } from '../../view-model/user-roles-view-model';
import { IPermissions } from '../edit-user-role/dto/interface/i-permissions';
import { IAddUserRole } from './dto/interface/i-add-user-role';

@Component({
  selector: 'app-user-role-modal',
  templateUrl: './add-user-role-modal.component.html',
  styleUrls: ['./add-user-role-modal.component.scss'],
})
export class AddUserRoleModalComponent implements OnInit, OnDestroy {
  subscription: Subscription[] = [];
  addUserRoleModel: IAddUserRole = {
    avatar : '',
    firstName: '',
    lastName: '',
    userName : '',
    password : '',
    roleName : '',
    roleIds : [],
    hasAdd : false,
    contactNo : '',
  };

  fileToUpload: File = null;
  imagePath;
  imgURL: any;
  message: string;
  addUserForm: FormGroup;
  selectAll = false;
  hidenPassword = true;
  mapIds: number[] = [];
  packer = false;
  deliver = false;
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
    public fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.vmUserRoles.setCheckbox(this.Permissions);
  }

  ngOnDestroy(): void {
    this.subscription.forEach((s) => {
      s.unsubscribe();
    });
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
    if (this.packer === true) {
      this.mapIds.push(43);
    }

    if (this.deliver === true) {
      this.mapIds.push(42)
    }
  }

  addUserRoleSubmit(model: IAddUserRole): void {

    if (model.hasAdd === true) {

      if (model.userName.length < 8) {
        alert('User name length must be 8 characters.');
        return;
      }

      if (model.userName.includes(' ')) {
        alert(`don't use space in user name can use '_' `);
        return;
      }

      if(model.firstName.length < 5){
        alert(`First name length must be 5 characters.`)
        return;
      }


      if(model.lastName.length < 5){
        alert(`Last name length must be 5 characters.`)
        return;
      }

      if(model.roleName.length < 5){
        alert(`Role length must be 5 characters.`)
        return;
      }

      if(model.contactNo.length < 5){
        alert(`Contact number length must be 5 characters.`)
        return;
      }


      if (model.password.length < 8 || model.password.includes(' ')) {
        alert('Password length must be 8 characters.');
        return;
      }


      this.getPacker();

      if (this.packer === false && this.deliver === false) {
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
      addNewModel.append('userName', model.userName.trim());
      addNewModel.append('password', model.password.trim());
      addNewModel.append('roleName', model.roleName.trim());
      addNewModel.append('roleIds', this.mapIds.toString());
      addNewModel.append('contactNo', model.contactNo.trim());
      addNewModel.append('avatar',(this.imagePath)?this.imagePath.name: '');
      console.log(addNewModel);

      const addModel = this.vmUserRoles.addUserRole(addNewModel).subscribe(
        (res) => {
          if (res > 0) {
            this.UpdateAfterAddUserRole(res);
            this.resetAddModel();
            alert('Add User Role Complete')
            this.closeFunc();
            this.toast.closeToast();
          }else if(res === -1){
            alert('The user name has exist...!');
            this.toast.closeToast();
          }else{
            alert('Please type again !');
            this.toast.closeToast();
          }


        },
        (err) => console.log(err),
        () => {
          this.subscription.push(addModel);
          this.toast.closeToast();
          this.mapIds = [];

        }
      );
    }
  }

  UpdateAfterAddUserRole(id: number): void {
    const addData: IUserRoles[] = [];
    const model: IUserRoles = {
      userId: id,
      firstName: this.addUserRoleModel.firstName,
      lastName: this.addUserRoleModel.lastName,
      role: this.addUserRoleModel.roleName,
      roleIds: this.mapRoleIds(),
      username: this.addUserRoleModel.userName,
      contactNo: this.addUserRoleModel.contactNo,
      avatar: '',
    };

    addData.push(model);
    const cat = addData.concat(this.vmUserRoles.userRoleList);
    this.vmUserRoles.userRoleList = cat;
  }

  resetAddModel(): void {
    const reset: IAddUserRole = {
      avatar : '',
      firstName: '',
      lastName: '',
      userName : '',
      password : '',
      roleName : '',
      roleIds : [],
      hasAdd : false,
      contactNo : '',
    };
    this.addUserRoleModel = reset;
  }

  closeFunc(): void {
    this.vmUserRoles.addModal = false;
    this.resetAddModel();
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
  }
  //end img

  selectAllFunc(roles: IPermissions) {
    if (roles.selectAll === true) {
      this.packer = false;
      this.deliver = false;
      roles.groupRoles.forEach((itx) => {
        itx.groupSelect = false;
        itx.roles.forEach((sub) => {
          sub.select = false;
        });
      });
    } else {
      this.packer = true;
      this.deliver = true;
      roles.groupRoles.forEach((itx) => {
        itx.groupSelect = true;
        itx.roles.forEach((sub) => {
          sub.select = true;
        });
      });
    }
  }

  clcikCheckBox(): void {

    if (this.Permissions.groupRoles.find(f => f.groupSelect === false)) {
      this.vmUserRoles.roleCheckBox.selectAll = false;
    }

    if (this.Permissions.groupRoles.map(m => m.roles)[0].find(f2 => f2.select === false)) {
      this.vmUserRoles.roleCheckBox.selectAll = false;
    }

  }

  checkChildren(id: number): void {
    const main = this.Permissions.groupRoles.find(f => f.groupId === id);
    main.roles.forEach(role => role.select = false);
  }

}
