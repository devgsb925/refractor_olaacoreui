import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { EndPoint } from 'src/app/security/end-point';
import { IUpdateOrder } from '../components/edit-order/model/i-update-order';
import { IUpdateOrderDetails } from '../components/edit-order/model/i-update-order-details';
import { IAddShipment } from '../components/edit-order/model/i-addShipment';
import { MAddNewProduct } from '../components/edit-order/model/m-add-new-product';
import { IAddShipmentDetail } from '../components/edit-order/model/i-add-shipment-detail';
import { IOrderHistory } from '../dto/interfaces/i-order-history';
import { IOrderDetails } from '../components/edit-order/interfaces/i-order-details';

@Injectable()
export class PageOrdersService {
  constructor(private http: HttpClient) {}

  private getVendorProductsTop50 =
    EndPoint.MainUri +
    'v1/api/purchasing/pending-orders/vendor-products-top-50	';
  private orderTop50Url =
    EndPoint.MainUri + 'v1/api/purchasing/orders/orders-top-50';
  private orderByOrderIdUrl =
    EndPoint.MainUri + 'v1/api/purchasing/orders/orders-by-order-id';
  private findOrderByVendorIdUrl =
    EndPoint.MainUri + 'v1/api/purchasing/orders/find-orders-by-vendor-id';
  private findOrdersByInvoiceNoUrl =
    EndPoint.MainUri + 'v1/api/purchasing/orders/find-orders-by-invoice-no';
  private getExchangeRatesReferencesUrl =
    EndPoint.MainUri + 'v1/api/purchasing/exchange-rates/active';

  private updateOrdersUrl =
    EndPoint.MainUri + 'v1/api/purchasing/orders/update-orders';
  private updateOrderDetailsUrl =
    EndPoint.MainUri + 'v1/api/purchasing/order-details/update';

  private deleteOrderDetailsByIdsUrl =
    EndPoint.MainUri + 'v1/api/purchasing/order-details/delete-order-details';

  private searchAddProductUrl =
    EndPoint.MainUri + 'v1/api/store/products/search-products';

  private addProductDetailUrl =
    EndPoint.MainUri + 'v1/api/purchasing/order-details/add-order-details';

  private addNewProductUrl =
    EndPoint.MainUri + 'v1/api/store/products/quick-add-product';

  private getShipmentByidUrl =
    EndPoint.MainUri + 'v1/api/purchasing/shipping/find-by-order-id';
  private deleteShipmentUrl =
    EndPoint.MainUri + 'v1/api/purchasing/shipping/delete-shipment';
  private addShipmentUrl =
    EndPoint.MainUri + 'v1/api/purchasing/shipping/add-shipments';

  private getShipmentDetailBySIdUrl =
    EndPoint.MainUri +
    'v1/api/purchasing/shipping/shipment-detail-by-shipment-id';
  private getOrderIncompleteListUrl =
    EndPoint.MainUri +
    'v1/api/purchasing/orders/incomplete-orders-with-order-details';
  private addShipmentDetailUrl =
    EndPoint.MainUri + 'v1/api/purchasing/shipping/add-shipment-detail';
  private editShipmentUrl =
    EndPoint.MainUri + 'v1/api/purchasing/shipping/update-shipment';
  private getCouriersUrl =
    EndPoint.MainUri + 'v1/api/purchasing/reference/ref-couriers';
  private getForwarderUrl =
    EndPoint.MainUri + 'v1/api/purchasing/reference/ref-forwarders';
  private removeShipmentDetaileUrl =
    EndPoint.MainUri + 'v1/api/purchasing/shipping/delete-shipment-details';
  private editShipmentDetailUrl =
    EndPoint.MainUri + 'v1/api/purchasing/shipping/update-shipment-details-qty';

  private urlUpdateOrderPaymentStatus =
    'v1/api/purchasing/orders/update-order-payment-status';

    private sortingByDateUrl =
    EndPoint.MainUri + 'v1/api/purchasing/orders/find-orders-by-date';

    private searchByInvoiceNoUrl = EndPoint.MainUri + 'v1/api/purchasing/orders/find-orders-by-invoice-no';
    private searchOrderUrl = EndPoint.MainUri + 'v1/api/purchasing/orders/find-orders-by-order-id-invoic-no-vender-id';

  updateOrderPaymentStatus(model: {
    orderId: number;
    status: number;
  }): Observable<number> {
    return this.http
      .put(EndPoint.MainUri + this.urlUpdateOrderPaymentStatus, model)
      .pipe(
        take(1),
        catchError(() => of('Server Error'))
      ) as Observable<number>;
  }

  deleteOrderDetailsByIds(model: IOrderDetails[]): Observable<any> {
    const delItems: any = {
      ids: [],
    };

    model.forEach((a) => delItems.ids.push(a.purchasingOrderDetailId));

    return this.http
      .post(this.deleteOrderDetailsByIdsUrl, delItems)
      .pipe(catchError((err) => of('server error.')));
  }

  updateOrderDetails(model: IUpdateOrderDetails[]): Observable<any> {
    return this.http
      .put(this.updateOrderDetailsUrl, model)
      .pipe(catchError((err) => of('server error.')));
  }

  updateOrders(model: IUpdateOrder): Observable<any> {
    return this.http
      .put(this.updateOrdersUrl, model)
      .pipe(catchError((err) => of(err)));
  }

  getExchangeRatesReferences(): Observable<any> {
    return this.http
      .get(this.getExchangeRatesReferencesUrl)
      .pipe(catchError((err) => of('server error.')));
  }

  findOrdersByInvoiceNo(kw: string): Observable<any> {
    const params = new HttpParams().set('invoiceno', kw);

    return this.http
      .get(this.findOrdersByInvoiceNoUrl, { params: params })
      .pipe(
        take(1),
        catchError((err) => of('server error.'))
      );
  }

  findOrderByVendorId(kw: string): Observable<any> {
    const params = new HttpParams().set('vid', kw);

    return this.http.get(this.findOrderByVendorIdUrl, { params: params }).pipe(
      take(1),
      catchError((err) => of('server error.'))
    );
  }

  getActiveExchangeRates(): Observable<any> {
    return this.http
      .get(this.getExchangeRatesReferencesUrl)
      .pipe(catchError(() => of('server error')));
  }

  orderByOrderId(orderid: number): Observable<any> {
    const params = new HttpParams().set('orderid', orderid.toString());

    return this.http
      .get(this.orderByOrderIdUrl, { params: params })
      .pipe(catchError((err) => of('server error.')));
  }

  orderTop50(): Observable<IOrderHistory[]> {
    return this.http.get(this.orderTop50Url).pipe(
      take(1),
      catchError((err) => of('server error.'))
    ) as Observable<IOrderHistory[]>;
  }

  searchAddProduct(searchtype, search): Observable<any> {
    const params = new HttpParams()
      .set('search', search.toString())
      .set('searchtype', searchtype.toString());

    return this.http
      .get(this.searchAddProductUrl, { params: params })
      .pipe(catchError((err) => of('server error.')));
  }

  addProductDetail(model): Observable<any> {
    return this.http
      .post(this.addProductDetailUrl, model)
      .pipe(catchError((err) => of(err)));
  }

  addNewProduct(model: MAddNewProduct): Observable<any> {
    console.log('addmodel' + model);

    return this.http
      .post(this.addNewProductUrl, model)
      .pipe(catchError((err) => of(err)));
  }

  getShipmentByid(orderid): Observable<any> {
    const params = new HttpParams().set('orderid', orderid.toString());

    return this.http
      .get(this.getShipmentByidUrl, { params: params })
      .pipe(catchError((err) => of('server error.')));
  }

  deleteShipment(id): Observable<any> {
    const params = new HttpParams().set('smid', id.toString());

    return this.http
      .delete(this.deleteShipmentUrl, { params: params })
      .pipe(catchError((err) => of('server error.')));
  }

  addShipment(model: IAddShipment): Observable<any> {
    return this.http
      .post(this.addShipmentUrl, model)
      .pipe(catchError((err) => of(err)));
  }

  getShipmentDetailBySId(sid): Observable<any> {
    const params = new HttpParams().set('sid', sid.toString());

    return this.http
      .get(this.getShipmentDetailBySIdUrl, { params: params })
      .pipe(catchError((err) => of('server error.')));
  }

  getOrderIncompleteList(): Observable<any> {
    return this.http
      .get(this.getOrderIncompleteListUrl)
      .pipe(catchError((err) => of(err)));
  }

  addShipmentDetail(model: IAddShipmentDetail): Observable<any> {
    return this.http
      .post(this.addShipmentDetailUrl, model)
      .pipe(catchError((err) => of(err)));
  }

  editShipment(model): Observable<any> {
    return this.http
      .put(this.editShipmentUrl, model)
      .pipe(catchError((err) => of(err)));
  }

  getCouriers(): Observable<any> {
    return this.http
      .get(this.getCouriersUrl)
      .pipe(catchError((err) => of(err)));
  }

  getForwarder(): Observable<any> {
    return this.http
      .get(this.getForwarderUrl)
      .pipe(catchError((err) => of(err)));
  }

  removeShipmentDetaile(model): Observable<any> {
    return this.http
      .post(this.removeShipmentDetaileUrl, model)
      .pipe(catchError((err) => of('server error.')));
  }

  editShipmentDetail(model): Observable<any> {
    return this.http
      .put(this.editShipmentDetailUrl, model)
      .pipe(catchError((err) => of(err)));
  }


  sortingByDate(fromDate : string, toDate : string): Observable<any>{
    const params = new HttpParams()
    .set('fromDate', fromDate.toString())
    .set('toDate', toDate.toString());
    return this.http
      .get(this.sortingByDateUrl, { params: params })
      .pipe(catchError((err) => of('server error.')));
  }

  searchOrderByInvoiceNo(ivno: string):Observable<any>{
    const params = new HttpParams()
    .set('invoiceno', ivno);

    return this.http.get(this.searchByInvoiceNoUrl, {params: params})
    .pipe(catchError((err)=> of ('server error.')))
  }

  searchOrder(kw :string): Observable<any>{
    const params = new HttpParams()
    .set('kw', kw);
    return this.http.get(this.searchOrderUrl, {params: params})
    .pipe(catchError((err)=> of ('server error.')))
  }

}
