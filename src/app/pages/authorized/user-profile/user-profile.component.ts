import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EndPoint } from 'src/app/security/end-point';
import { UserViewModel } from './view-model/user-view-model.service';
import { MUpdateProfile } from './dto/model/m-update-profile'

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit, OnDestroy {

  profile_form : FormGroup;
  subscriptions: Subscription[] = [];
  baseUrl = EndPoint.MainUri + 'files/';

  fileToUpload: File = null;
  imagePath;
  imgURL: any;
  message: string;

  constructor(
    public vmUser : UserViewModel,
    public fb : FormBuilder,
    ) {
      this.isForm();
    }


  ngOnInit(): void {
   const userSub = this.vmUser.getProfile().subscribe(res => {
     if(res !== undefined){
      this.vmUser.setUSerProfile(res);
      this.setForm();
     }

    },(err)=> console.log(err),
    () => {
      this.subscriptions.push(userSub);
    }
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
   }

   isForm(){
    this.profile_form = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(128),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(128),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.maxLength(128),
          Validators.minLength(8),
          Validators.email
        ],
      ],
      mobileNo: [
        '',
        [
          Validators.required,
          Validators.maxLength(128),
          Validators.minLength(8),
        ],
      ],
      hasEdit: [
        true,
        [],
      ],
      avatar: [
        '',[]
      ],
      newPassword: ['',[Validators.required]]
    })
   }

   setForm(): void{
    this.profile_form.controls.firstName.setValue(this.vmUser.userProfile.firstName);
    this.profile_form.controls.lastName.setValue(this.vmUser.userProfile.lastName);
    this.profile_form.controls.email.setValue(this.vmUser.userProfile.email);
    this.profile_form.controls.mobileNo.setValue(this.vmUser.userProfile.mobileNo);
    this.profile_form.controls.avatar.setValue(this.vmUser.userProfile.avatar);
   }

   saveSubMit():void{
    const model = this.profile_form.value;
    const update = new FormData();

    update.append('firstName', model.firstName);
    update.append('lastName', model.lastName);
    update.append('email', model.email);
    update.append('mobileNo', model.mobileNo);
    update.append('newPassword', '');
    update.append('avatar', this.vmUser.userProfile.avatar);
    update.append('file', this.fileToUpload);

    const updateSub = this.vmUser.updateUser(update).subscribe(res => {

      if(res == 0){
        alert('Update failed.')
      }else{
        alert('Update compelete')
        this.profile_form.controls.avatar.setValue('');
      }

    },(err)=> console.log(err),
    () => {
      this.subscriptions.push(updateSub);
    }
    )
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
  }



}
