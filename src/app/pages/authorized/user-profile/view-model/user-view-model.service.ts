import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { UserProfileService } from '../api/user-profile.service';
import { IUserProfile } from '../dto/interfaces/i-user-profiles';

@Injectable()
export class UserViewModel {
  userProfile: IUserProfile;
  tabs = 0;

  constructor(private apiUser: UserProfileService) {}

  getProfile(): Observable<IUserProfile>{
    return this.apiUser.getUser();
  }

  setUSerProfile(user:IUserProfile ):void{
    this.userProfile = user;
  }

  updateUser(form : FormData):Observable<any>{
      return this.apiUser.updateProfile(form);
  }

}
