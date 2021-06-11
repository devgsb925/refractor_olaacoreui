import { MProduct } from './interfaces/m-product';
import { catchError, share, take } from 'rxjs/operators';
import { EndPoint } from './../../../security/end-point';
import { IProductSource } from './interfaces/i-product-source';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ProductsApiService {
  constructor(private http: HttpClient) {}

  private urlGetList = EndPoint.MainUri + 'v1/api/store/products/get-list';
  private urlUpdateProduct = 'v1/api/store/products/quick-update-product';
  private urlDeleteProduct = 'v1/api/store/products/delete-product';

  getList(
    kw: string,
    skip: number,
    count: number
  ): Observable<IProductSource[]> {
    const params = new HttpParams()
      .append('kw', kw.toLowerCase())
      .append('skip', skip.toString())
      .append('count', count.toString());
    return this.http
      .get<IProductSource[]>(this.urlGetList, { params })
      .pipe(take(1), share());
  }

  updateProduct(model: MProduct): Observable<number> {
    return this.http
      .put<number>(EndPoint.MainUri + this.urlUpdateProduct, model)
      .pipe(take(1));
  }

  deleteProduct(productId: number): Observable<number> {
    const params = new HttpParams().set('productId', productId.toString());
    return this.http
      .delete(EndPoint.MainUri + this.urlDeleteProduct, { params })
      .pipe(
        take(1),
        catchError(() => of('Server Error'))
      ) as Observable<number>;
  }
}
