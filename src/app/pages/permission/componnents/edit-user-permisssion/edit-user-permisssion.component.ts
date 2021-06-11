import { Component, OnInit } from '@angular/core';
import { EndPoint } from 'src/app/security/end-point';
import { PermissionService } from '../../view-model/permission.service';

@Component({
  selector: 'app-edit-user-permisssion',
  templateUrl: './edit-user-permisssion.component.html',
  styleUrls: ['./edit-user-permisssion.component.scss']
})
export class EditUserPermisssionComponent implements OnInit {

  passwordType = false;
  baseUrl = EndPoint.MainUri + 'files/';
  loadEditImgUrl: string;
  fileToUpload: File = null;
  imagePath;
  imgURL: any;
  message: string;

  constructor(
    public vmPermission : PermissionService,
  ) { }

  ngOnInit(): void {
    this.loadImg();
  }

  changePageFunc(id: number):void{
    this.vmPermission.activePage = id;
  }

  changePasswordType():void{
    this.passwordType =! this.passwordType;
  }

  loadImg(): void{
    this.loadEditImgUrl = this.vmPermission.editUserModel.avatar;
  }

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

}
