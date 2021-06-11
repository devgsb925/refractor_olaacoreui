import { EndPoint } from 'src/app/security/end-point';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { IProductTable } from './dto/interface/i-product-table';

@Injectable()
export class AddOrderDetailApiService {
  constructor(private http: HttpClient) {}

  private getProductByvendorIdUrl =
    EndPoint.MainUri +
    'v1/api/purchasing/vendor-products/lar-products-by-vendor-id';

  private addProductToOrderUrl =
    EndPoint.MainUri + 'v1/api/purchasing/order-details/add-order-details';

  private searchProductUrl =
    EndPoint.MainUri + 'v1/api/store/products/lar-search-products-full-options';

  getProductByvendorId(vid: number): Observable<IProductTable[]> {
    const param = new HttpParams().set('vendorId', vid.toString());
    return this.http
      .get(this.getProductByvendorIdUrl, {
        params: param,
      })
      .pipe(
        take(1),
        catchError(() => of('Server Error'))
      ) as Observable<IProductTable[]>;
  }

  addProductToOrder(model): Observable<any> {
    return this.http
      .post(this.addProductToOrderUrl, model)
      .pipe(catchError((res) => of(res))) as Observable<any>;
  }

  searchProduct(vid: number, search: string): Observable<any> {
    const params = new HttpParams()
      .set('vendorId', vid.toString())
      .set('search', search);
    return this.http
      .get(this.searchProductUrl, {
        params,
      })
      .pipe(catchError(() => of('Server Error'))) as Observable<any>;
  }
}
