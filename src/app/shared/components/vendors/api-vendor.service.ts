import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { IVendor } from './i-vendor';
import { EndPoint } from './../../../security/end-point';
@Injectable()
export class ApiVendorService {
  constructor(private http: HttpClient) {}

  private urlGetList = EndPoint.MainUri + 'v1/api/purchasing/vendors/get-list';

  getList(kw: string, skip: number, count: number): Observable<IVendor[]> {
    const params = new HttpParams()
      .append('kw', kw)
      .append('skip', skip.toString())
      .append('count', count.toString());
    return this.http.get<IVendor[]>(this.urlGetList, {params}).pipe(take(1))
  }
}
