import { IVendorProduct } from './../dto/interfaces/i-vendor-product';
import { IVendorDetail } from './../dto/interfaces/i-vendor-detail';
import { ILoadVendor } from './../dto/interfaces/i-load-vendor';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { EndPoint } from '../../../security/end-point';
import { Router } from '@angular/router';
import {VendorOrder} from '../dto/interfaces/vendor-order';

@Injectable()
export class VendorService {

  public loadAllVendorUrl = EndPoint.MainUri + 'api/purchasing/vendors'; // ok verified

  public getVendorDetailByVendorIdUrl =EndPoint.MainUri + 'api/purchasing/vendors/details'; // ok verified

  public getVendorOrderByvendorIdUrl = EndPoint.MainUri + 'api/purchasing/vendors/orders'; // ok verified

  public updateVendorUrl = EndPoint.MainUri + 'api/purchasing/vendors/update-details';  // ok verified

  public addNewVendorUrl = EndPoint.MainUri + 'api/purchasing/vendors/add';  // ok verified

  public getVendorProductByvendorIdUrl = EndPoint.MainUri +'api/purchasing/vendors/products';  // ok verified

  public searchVendorUrl =EndPoint.MainUri + 'v1/api/purchasing/vendors/search-full-option';


  public searVendorProductUrl = EndPoint.MainUri +'v1/api/purchasing/vendor-products/search-vendor-products-full-options';


  public orderByOrderIdUrl = EndPoint.MainUri + 'v1/api/purchasing/orders/orders-by-order-id'

  constructor(private http: HttpClient, private router: Router) {}

  vendors(kw: string): Observable<ILoadVendor> {

    const params = new HttpParams().set('kw', kw);

    return this.http
      .get(this.loadAllVendorUrl, {
        params: params
      })
      .pipe(
        catchError((err) => of('server error.'))
      ) as Observable<ILoadVendor>;
  }

  getVendorDetailByVendorId(vid): Observable<IVendorDetail> {
    const params = new HttpParams().set('vendorId', vid.toString());

    return this.http
      .get(this.getVendorDetailByVendorIdUrl, {
        params,
      })
      .pipe(
        catchError((err) => of('server error.'))
      ) as Observable<IVendorDetail>;
  }

  getVendorProductByvendorId(vid: number): Observable<IVendorProduct> {
    const params = new HttpParams().set('vendorId', vid.toString());

    return this.http
      .get(this.getVendorProductByvendorIdUrl, {
        params,
      })
      .pipe(
        catchError((err) => of('server error.'))
      ) as Observable<IVendorProduct>;
  }

  searchVendor(search: string): Observable<ILoadVendor> {
    const params = new HttpParams().set('search', search);

    return this.http
      .get(this.searchVendorUrl, {
        params,
      })
      .pipe(
        catchError((err) => of('server error.'))
      ) as Observable<ILoadVendor>;
  }

  searVendorProduct(vendorId, search: string): Observable<IVendorProduct> {
    const params = new HttpParams()
      .set('vendorId', vendorId.toString())
      .set('search', search);

    return this.http
      .get(this.searVendorProductUrl, {
        params,
      })
      .pipe(
        catchError((err) => of('server error.'))
      ) as Observable<IVendorProduct>;
  }

  updateVendor(model): Observable<any> {
    return this.http
      .put(this.updateVendorUrl, model)
      .pipe(catchError(() => of('server error'))) as Observable<any>;
  }

  addNewVendor(model): Observable<number> {
    return this.http
      .post(this.addNewVendorUrl, model)
      .pipe(catchError(() => of('server error'))) as Observable<number>;
  }


  getVendorOrderByvendorId(vid: number): Observable<VendorOrder[]>{

      const params = new HttpParams().set('vendorid', vid.toString());
      return this.http
        .get(this.getVendorOrderByvendorIdUrl, {
          params,
        })
        .pipe(
          catchError((err) => of('server error.'))
        ) as Observable<VendorOrder[]>
  }

  orderByOrderId(orderid: number): Observable<any> {
    const params = new HttpParams().set('orderid', orderid.toString());

    return this.http
      .get(this.orderByOrderIdUrl, { params: params })
      .pipe(catchError((err) => of('server error.')));
  }

}
