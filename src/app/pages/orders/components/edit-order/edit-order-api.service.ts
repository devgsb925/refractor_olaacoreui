import { IShipmentDetail } from './interfaces/i-shipment-detail';
import { IShipment } from './../../../stockin-actives/interfaces/i-shipment';
import { MUpdateAddNewProduct } from './interfaces/m-add-new-product';
import { EndPoint } from 'src/app/security/end-point';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { IEditOrder } from './interfaces/i-edit-order';
import { MUpdateOrder } from './interfaces/m-update-order';

@Injectable({
  providedIn: 'root',
})
export class EditOrderApiService {
  constructor(private http: HttpClient) {}

  private urlGetOrderDetail = 'v1/api/purchasing/orders/orders-by-order-id';

  private urlUpdateOrder =
    'v1/api/purchasing/order-details/update-order-with-details';

  private urlAddNewProduct =
    'v1/api/store/products/add-products-with-order-details';

  private urlDeleteOrderDetails =
    'v1/api/purchasing/order-details/delete-order-details';

  /// url for shipment
  private urlGetShipmentByOrderId =
    'v1/api/purchasing/shipping/find-by-order-id';

  private urlGetShipmentDetailByShipmentIds =
    'v1/api/purchasing/shipping/shipment-detail-by-shipment-ids';

  private urlGetShipmentByOrderIdAndShipId =
    'v1/api/purchasing/shipping/find-by-shipment-id-with-order-id';

  private urlGetShipmentByOrderIdAndForwarderNo =
    'v1/api/purchasing/shipping/find-by-forwarder-no-with-order-id';

  private urlGetShipmentByOrderIdAndTrackingNo =
    'v1/api/purchasing/shipping/find-by-tracking-no-with-order-id';

  private searchShipmentUrl =
    EndPoint.MainUri + 'v1/api/purchasing/shipping/find-shipments-full-options';

  getOrderDetail(id: number): Observable<IEditOrder> {
    const param = new HttpParams().set('orderid', id.toString());
    return this.http
      .get(EndPoint.MainUri + this.urlGetOrderDetail, { params: param })
      .pipe(
        take(1),
        catchError(() => of('Server Error'))
      ) as Observable<IEditOrder>;
  }

  getShipmentByOrderId(id: number): Observable<IShipment[]> {
    const param = new HttpParams().set('orderId', id.toString());
    return this.http
      .get(EndPoint.MainUri + this.urlGetShipmentByOrderId, { params: param })
      .pipe(
        take(1),
        catchError(() => of('Server Error'))
      ) as Observable<IShipment[]>;
  }

  getShipmentById(id: number, orderId: number): Observable<IShipment[]> {
    const param = new HttpParams()
      .set('sid', id.toString())
      .set('orderId', orderId.toString());
    return this.http
      .get(EndPoint.MainUri + this.urlGetShipmentByOrderIdAndShipId, {
        params: param,
      })
      .pipe(
        take(1),
        catchError(() => of('Server Error'))
      ) as Observable<IShipment[]>;
  }

  getShipmentByForwarderNo(
    no: string,
    orderId: number
  ): Observable<IShipment[]> {
    const param = new HttpParams()
      .set('fNo', no)
      .set('orderId', orderId.toString());
    return this.http
      .get(EndPoint.MainUri + this.urlGetShipmentByOrderIdAndForwarderNo, {
        params: param,
      })
      .pipe(
        take(1),
        catchError(() => of('Server Error'))
      ) as Observable<IShipment[]>;
  }
  getShipmentByTrackingNo(
    no: string,
    orderId: number
  ): Observable<IShipment[]> {
    const param = new HttpParams()
      .set('trackingNo', no)
      .set('orderId', orderId.toString());
    return this.http
      .get(EndPoint.MainUri + this.urlGetShipmentByOrderIdAndTrackingNo, {
        params: param,
      })
      .pipe(
        take(1),
        catchError(() => of('Server Error'))
      ) as Observable<IShipment[]>;
  }

  getShipmentDetailByShipIds(ids: number[]): Observable<IShipmentDetail[]> {
    const model = { smids: ids };
    return this.http
      .post(EndPoint.MainUri + this.urlGetShipmentDetailByShipmentIds, model)
      .pipe(
        take(1),
        catchError(() => of('Server Error'))
      ) as Observable<IShipmentDetail[]>;
  }

  updateOrder(model: MUpdateOrder): Observable<number> {
    return this.http.put(EndPoint.MainUri + this.urlUpdateOrder, model).pipe(
      take(1),
      catchError(() => of('Server Error'))
    ) as Observable<number>;
  }

  addProduct(model: MUpdateAddNewProduct): Observable<any> {
    return this.http.post(EndPoint.MainUri + this.urlAddNewProduct, model).pipe(
      take(1),
      catchError(() => of('Server Error'))
    ) as Observable<any>;
  }

  deleteOrderDetails(model: { ids: number[] }): Observable<number> {
    return this.http
      .post(EndPoint.MainUri + this.urlDeleteOrderDetails, model)
      .pipe(
        take(1),
        catchError(() => of('Server Error'))
      ) as Observable<number>;
  }

  searchShipment(oid: number, search: string): Observable<any> {
    const params = new HttpParams()
      .set('orderId', oid.toString())
      .set('search', search);
    return this.http
      .get(this.searchShipmentUrl, {
        params,
      })
      .pipe(catchError(() => of('Server Error'))) as Observable<any>;
  }
}
