import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { of } from 'rxjs';
import { EndPoint } from '../../security/end-point';

@Injectable()
export class LoginService {

  private userLoginUrl = EndPoint.MainUri + 'api/authenticate/login';
  private pagesUrl = EndPoint.MainUri + 'api/employees/pages';
  private rolesUrl = EndPoint.MainUri + 'api/employees/roles';

  constructor(
    private http: HttpClient
  ) {
  }

  login(model: any): Observable<any> {

      return this.http
      .post(this.userLoginUrl, model)
      .pipe(catchError((err) => of(err)));
  }

  pages(): Observable<any> {

    return this.http
    .get(this.pagesUrl)
    .pipe(
      take(1),
      catchError((err) => of(err)));
  }

  roles(): Observable<any> {

    return this.http
    .get(this.rolesUrl)
    .pipe(
      take(1),
      catchError((err) => of(err)));
  }
}

