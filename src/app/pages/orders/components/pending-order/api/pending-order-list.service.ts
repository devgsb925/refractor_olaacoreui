import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EndPoint } from 'src/app/security/end-point';
import { MDeletePendingOrder } from '../dto/model/m-delete-pending-order';
import { MSeaerchPendingOrder } from '../dto/model/m-seaerch-pending-order';

@Injectable()
export class PendingOrderListService {
  constructor(private http: HttpClient) {}

  private getVendorUrl =
    EndPoint.MainUri +
    'v1/api/purchasing/pending-orders/vendors-in-pending-orders';
  private getOrderDetailByVendorIdUrl =
    EndPoint.MainUri + 'v1/api/purchasing/pending-orders/v2-find-by-vendor-id';
  private searVenderUrl =
    EndPoint.MainUri + 'v1/api/purchasing/pending-orders/search-vendors';
  private searchOrderUrl =
    EndPoint.MainUri +
    'v1/api/purchasing/pending-orders/find-by-product-brand-model';
  private removePendingOrderUrl =
    EndPoint.MainUri + 'v1/api/purchasing/pending-orders/delete';
  private updatePendingOrderListUrl =
    EndPoint.MainUri + 'v1/api/purchasing/pending-orders/update';
  private submitPendingOrderUrl =
    EndPoint.MainUri + 'v1/api/purchasing/pending-orders/submit';

  private searchVendorListUrl = EndPoint.MainUri + 'v1/api/purchasing/pending-orders/v2-search-vendor';
  private searchVendorProductListUrl = EndPoint.MainUri + 'v1/api/purchasing/pending-orders/find-vendor-products-by-product-id-sku-product-no-brand';

  getVendor(): Observable<any> {
    return this.http
      .get(this.getVendorUrl)
      .pipe(catchError(() => of('server error')));
  }

  getOrderDetailByVendorId(vid: number): Observable<any> {
    const params = new HttpParams().set('vid', vid.toString());
    return this.http
      .get(this.getOrderDetailByVendorIdUrl, { params })
      .pipe(catchError((err) => of('server error.')));
  }

  searVender(option, searchValue): Observable<any> {
    const params = new HttpParams()
      .set('value', option.toString())
      .set('search', searchValue.toString());

    return this.http
      .get(this.searVenderUrl, { params })
      .pipe(catchError((err) => of('server error.')));
  }

  searchOrder(model: MSeaerchPendingOrder): Observable<any> {
    const params = new HttpParams()
      .set('vid', model.vid.toString())
      .set('value', model.value.toString())
      .set('search', model.search.toString());

    return this.http
      .get(this.searchOrderUrl, { params })
      .pipe(catchError((err) => of('server error.')));
  }

  removePendingOrder(model: MDeletePendingOrder): Observable<number> {
    return this.http
      .post(this.removePendingOrderUrl, model)
      .pipe(catchError((err) => of(err))) as Observable<number>;
  }

  updatePendingOrderList(model): Observable<number> {
    return this.http
      .put(this.updatePendingOrderListUrl, model)
      .pipe(catchError((err) => of(err))) as Observable<number>;
  }

  submitPendingOrder(model): Observable<any> {
    return this.http
      .post(this.submitPendingOrderUrl, model)
      .pipe(catchError((err) => of(err))) as Observable<any>;
  }

  searchVendorList(kw : string):Observable<any>{
    const params = new HttpParams()
    .set('kw', kw)
    return this.http
    .get(this.searchVendorListUrl, { params })
    .pipe(catchError((err) => of('server error.')));
  }

  searchVendorProductList(kw: string, vid: number): Observable<any>{
    const params = new HttpParams()
    .set('vid', vid.toString())
    .set('kw', kw)
    return this.http
    .get(this.searchVendorProductListUrl, {params})
    .pipe(catchError((err) => of('server error.')))

  }

}
