import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EndPoint } from 'src/app/security/end-point';
import { IUserRoles } from '../dto/interface/i-user-roles';

@Injectable()
export class UserRolesApiService {
  private getUserRoleUrl = EndPoint.MainUri + 'v1/api/base/user-role/users';
  private searchUserRoleUrl =
    EndPoint.MainUri + 'v1/api/base/user-role/search-users';
  private addUserRoleUrl = EndPoint.MainUri + 'v1/api/base/user-role/add-user';
  private editUserRoleUrl =
    EndPoint.MainUri + 'v1/api/base/user-role/update-user-role';

  constructor(private http: HttpClient) {}

  getUserRole(): Observable<IUserRoles[]> {
    return this.http
      .get(this.getUserRoleUrl)
      .pipe(catchError((err) => of('server error.'))) as Observable<
      IUserRoles[]
    >;
  }

  searchUserRole(search: string): Observable<IUserRoles[]> {
    const params = new HttpParams().set('searchValue', search);
    return this.http
      .get(this.searchUserRoleUrl, { params })
      .pipe(catchError((err) => of('server error.'))) as Observable<
      IUserRoles[]
    >;
  }

  addUserRole(model: FormData): Observable<number> {
    return this.http
      .post(this.addUserRoleUrl, model)
      .pipe(catchError(() => of('Server Error'))) as Observable<number>;
  }

  editUserRole(model: FormData): Observable<number> {
    return this.http
      .put(this.editUserRoleUrl, model)
      .pipe(catchError(() => of('Server Error'))) as Observable<number>;

  }
}
