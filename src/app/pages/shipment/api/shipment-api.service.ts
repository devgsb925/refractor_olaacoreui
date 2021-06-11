import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { of } from 'rxjs';
import { EndPoint } from '../../../security/end-point';
import { IShipment } from '../dto/interfaces/i-shipment';
import { IShipmentDetail } from '../dto/interfaces/i-shipment-detail';
import { IOrderIncomplete } from '../dto/interfaces/i-order-incomplete';
import { IRefForwarders } from '../dto/interfaces/i-ref-forwarder';
import { IRefCouriers } from '../dto/interfaces/i-ref-couriers';
import { IMUpdateShipmentDetailsList } from '../dto/model/m-update-shipment-details-list';
import { IShipmentVendor } from '../dto/interfaces/i-shipment-vendors';
import { IShipmentVendorProducts } from '../dto/interfaces/i-shipment-vendor-products';
import { IAddShipment } from '../dto/model/m-add-shipment';
import { IMDeleteShipmentDetails } from '../dto/model/m-delete-shipment-details';
import { MAddShipmentDetailsList } from '../dto/model/m-add-shipment-details-list';
import { IUpdateJShipment } from '../dto/model/m-update-jshipment';
import { MAddToStock } from '../dto/model/m-add-to-stock';

@Injectable()
export class ShipmentApiService {
  private getTop50ShipmentUrl =
    EndPoint.MainUri + 'v1/api/purchasing/shipping/top-50';
  private getShipmentDetailByShipmentIdUrl =
    EndPoint.MainUri +
    'v1/api/purchasing/shipping/shipment-detail-by-shipment-id';
  private addShipmentUrl =
    EndPoint.MainUri + 'v1/api/purchasing/shipping/add-shipment';
  private getIncompleteOrderUrl =
    EndPoint.MainUri +
    'v1/api/purchasing/orders/incomplete-orders-with-order-details';
  private deleteshipmentUrl =
    EndPoint.MainUri + 'v1/api/purchasing/shipping/delete-shipment';
  private deleteShipmentDetailsUrl =
    EndPoint.MainUri + 'v1/api/purchasing/shipping/jdelete-shipment-details';
  private updateShipmentUrl =
    EndPoint.MainUri + 'v1/api/purchasing/shipping/update-shipment';
  private updateJShipmentUrl =
    EndPoint.MainUri + 'v1/api/purchasing/shipping/jupdate-shipment';
  private updateShipmentDetailsUrl =
    EndPoint.MainUri + 'v1/api/purchasing/shipping/jupdate-shipment-details';
  private refForwardersUrl =
    EndPoint.MainUri + 'v1/api/purchasing/reference/ref-forwarders';
  private refCouriersUrl =
    EndPoint.MainUri + 'v1/api/purchasing/reference/ref-couriers';
  private vendorsUrl =
    EndPoint.MainUri + 'v1/api/purchasing/vendors/shipping-vendors';
  private getShippingVendorProductsUrl =
    EndPoint.MainUri + 'v1/api/purchasing/vendors/get-shipping-vendor-products';
  private addShipmentDetailUrl =
    EndPoint.MainUri + 'v1/api/purchasing/shipping/jadd-shipment-detail';
  private searchShipmentUrl =
    EndPoint.MainUri + 'v1/api/purchasing/shipping/search';
  private addToStockUrl =
    EndPoint.MainUri + 'v1/api/purchasing/shipping/add-to-stock';

  private sortingByDateUrl = EndPoint.MainUri + 'v1/api/purchasing/shipping/search-by-date';

  constructor(private http: HttpClient) {}

  addShipmentDetail(model: MAddShipmentDetailsList): Observable<any> {
    return this.http
      .post(this.addShipmentDetailUrl, model)
      .pipe(catchError((err) => of('server error.')));
  }

  deleteShipmentDetails(model: IMDeleteShipmentDetails): Observable<number> {
    return this.http
      .post(this.deleteShipmentDetailsUrl, model)
      .pipe(catchError((err) => of(err))) as Observable<number>;
  }

  getShippingVendorProducts(
    vid: number
  ): Observable<IShipmentVendorProducts[]> {
    const params = new HttpParams().set('vid', vid.toString());

    return this.http
      .get(this.getShippingVendorProductsUrl, {
        params: params,
      })
      .pipe(catchError(() => of('server error'))) as Observable<
      IShipmentVendorProducts[]
    >;
  }

  getVendors(): Observable<IShipmentVendor[]> {
    return this.http
      .get(this.vendorsUrl)
      .pipe(catchError(() => of('server error'))) as Observable<
      IShipmentVendor[]
    >;
  }

  getRefCouriers(): Observable<IRefCouriers[]> {
    return this.http
      .get(this.refCouriersUrl)
      .pipe(catchError(() => of('server error'))) as Observable<IRefCouriers[]>;
  }

  getRefForwarders(): Observable<IRefForwarders[]> {
    return this.http
      .get(this.refForwardersUrl)
      .pipe(catchError(() => of('server error'))) as Observable<
      IRefForwarders[]
    >;
  }

  getTop50Shipment(): Observable<IShipment[]> {
    return this.http
      .get(this.getTop50ShipmentUrl)
      .pipe(catchError(() => of('server error'))) as Observable<IShipment[]>;
  }

  getShipmentDetailByShipmentId(sid): Observable<IShipmentDetail[]> {
    const params = new HttpParams().set('sid', sid);

    return this.http
      .get(this.getShipmentDetailByShipmentIdUrl, { params })
      .pipe(
        take(1),
        catchError((err) => of('server error.'))
      ) as Observable<IShipmentDetail[]>;
  }

  addShipment(model: IAddShipment): Observable<IShipment> {
    return this.http
      .post(this.addShipmentUrl, model)
      .pipe(catchError((err) => of(err))) as Observable<IShipment>;
  }

  getIncompleteOrder(): Observable<IOrderIncomplete> {
    return this.http
      .get(this.getIncompleteOrderUrl)
      .pipe(
        catchError(() => of('server error'))
      ) as Observable<IOrderIncomplete>;
  }

  deleteshipment(did: number): Observable<any> {
    const params = new HttpParams().set('smid', did.toString());
    return this.http
      .delete(this.deleteshipmentUrl, { params })
      .pipe(catchError((err) => of('server error.'))) as Observable<any>;
  }

  updateJShipment(model: IUpdateJShipment): Observable<number> {
    return this.http
      .put(this.updateJShipmentUrl, model)
      .pipe(catchError((err) => of(err)));
  }

  updateShipment(model: any): Observable<any> {
    return this.http
      .put(this.updateShipmentUrl, model)
      .pipe(catchError((err) => of(err)));
  }

  updateShipmentDetails(
    model: IMUpdateShipmentDetailsList
  ): Observable<IShipmentDetail[]> {
    return this.http
      .put<IShipmentDetail[]>(this.updateShipmentDetailsUrl, model)
      .pipe(catchError((err) => of(err)));
  }

  searchShipment(search: string): Observable<IShipment[]> {
    const params = new HttpParams().set('search', search);
    return this.http
      .get(this.searchShipmentUrl, { params })
      .pipe(catchError((err) => of('server error.'))) as Observable<
      IShipment[]
    >;
  }

  addToStock(model: MAddToStock): Observable<number> {
    return this.http
      .post(this.addToStockUrl, model)
      .pipe(catchError((err) => of(err)));
  }

  sortingByDate(form: Date, to: Date): Observable<any>{
    const params = new HttpParams()
    .set('fromDate', form.toString())
    .set('toDate', to.toString());
    return this.http
      .get(this.sortingByDateUrl, { params: params })
      .pipe(catchError((err) => of('server error.')));
  }
}
