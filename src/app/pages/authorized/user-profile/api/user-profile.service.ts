import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { EndPoint } from '../../../../security/end-point';
import { IUserProfile } from '../dto/interfaces/i-user-profiles';


@Injectable()
export class UserProfileService {
  private getUserUrl = EndPoint.MainUri + 'v1/api/base/get-user-info';
  private updateUserProfileUrl = EndPoint.MainUri + 'v1/api/base/update-user-profile';

  constructor(private http: HttpClient) {}

  getUser(): Observable<any> {
    return this.http
      .get<IUserProfile>(this.getUserUrl)
      .pipe(catchError(() => of('server error')));
  }

  updateProfile(form: FormData): Observable<any> {
    return this.http
      .put(this.updateUserProfileUrl, form)
      .pipe(catchError((err) => of('server error.')));
  }


  // changePassword(model: any): Observable<any> {
  //   return this.http
  //     .put(this.changePasswordUrl, model)
  //     .pipe(catchError((err) => of('server error.')));
  // }

}
