import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { EndPoint } from 'src/app/security/end-point';
import { IShipment } from './interfaces/i-shipment';
import { IOrderIncomplete } from './interfaces/i-order-incomplete';
import { MUpdateShipDetail } from './model/m-update-recieved';
import { MSearchParam } from './model/m-search-param';
import { IShipmentDetail } from './interfaces/i-shipment-detail';
import { IBarcode } from './interfaces/i-barcode';

@Injectable()
export class StockInApiService {

  constructor(private http: HttpClient) { }

  private urlAddImeiCode = 'v1/api/warehouse-imeis/add-imei';


  // private urlGetShipmentIncomplete = "v1/api/purchasing/shipping/incomplete-shipments";

  private urlGetShipmentIncomplete = 'v1/api/purchasing/shipping/all-incomplete-shipments';

  private urlGetShipmentDetailByShipmentIds = 'v1/api/purchasing/shipping/shipment-detail-by-shipment-ids';


  private urlUpdateShipmentDetail = 'v1/api/purchasing/shipping/update-shipment-details';


  private urlUpdateBarcode = 'v1/api/store/products/update-product-barcode-by-product-id';


  // private searchStockinUrl = "v1/api/purchasing/shipping/search-stock-in-shipment";




  getShipmentIncomplete(): Observable<IShipment[]> {
    return this.http.get(EndPoint.MainUri + this.urlGetShipmentIncomplete).pipe(
      take(1),
      catchError(() => of('Server Error'))
    ) as Observable<IShipment[]>;

  }

  getShipmentDetailByShipmentIds(model): Observable<IShipmentDetail[]> {
    return this.http.post(EndPoint.MainUri + this.urlGetShipmentDetailByShipmentIds, model).pipe(
      take(1),
      catchError(() => of('Server Error'))
    ) as Observable<IShipmentDetail[]>;
  }

  addImeiCode(model): Observable<any> {
    return this.http.post(EndPoint.MainUri + this.urlAddImeiCode, model).pipe(
      take(1),
      catchError(() => of('Server Error'))
    );
  }

  updateShipmentDetail(model): Observable<any> {

    return this.http.put(EndPoint.MainUri + this.urlUpdateShipmentDetail, model).pipe(
      take(1),
      catchError(() => of('Server Error'))
    );
  }

  updateBarcode(model: { updateBarcodes: IBarcode[]; }): Observable<any> {
    return this.http.put(EndPoint.MainUri + this.urlUpdateBarcode, model).pipe(
      take(1),
      catchError(() => of('Server Error'))
    );
  }


}
