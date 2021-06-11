import { IUpdateBrandOrderIndex } from './interfaces/i-update-brand-order-index';
import { EndPoint } from 'src/app/security/end-point';
import { Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { MUpdateBrandName } from './components/brands/interfaces/m-update-brand-name';

@Injectable()
export class ValuesSettingApiService {
  constructor(private http: HttpClient) {}

  private urlUpdateBrand =
    EndPoint.MainUri + 'v1/api/store/products/brands/update';
  private urlReuploadBrandImage =
    EndPoint.MainUri + 'v1/api/store/products/brands/reupload-image';
  private urlDeleteBrandImage =
    EndPoint.MainUri + 'v1/api/store/products/brands/delete-image';
  private urlUpdateBrandOrderIndex =
    EndPoint.MainUri + 'v1/api/store/products/brands/update-order-index';
  reuploadBrandImage(
    formData: FormData
  ): Observable<HttpEvent<unknown> | number> {
    return this.http.post<HttpEvent<unknown> | number>(
      this.urlReuploadBrandImage,
      formData,
      {
        observe: 'events',
        reportProgress: true,
      }
    );
  }

  updateBrandName(model: MUpdateBrandName): Observable<number> {
    return this.http.put<number>(this.urlUpdateBrand, model).pipe(take(1));
  }

  updateBrandOrdexIndex(
    orderIndexList: IUpdateBrandOrderIndex[]
  ): Observable<number> {
    const model = { orderIndexList };
    return this.http
      .patch<number>(this.urlUpdateBrandOrderIndex, model)
      .pipe(take(1));
  }

  deleteBrandImage(id: number, url): Observable<number> {
    const params = new HttpParams().set('id', id.toString()).set('url', url);
    return this.http
      .delete<number>(this.urlDeleteBrandImage, { params })
      .pipe(take(1));
  }
}
