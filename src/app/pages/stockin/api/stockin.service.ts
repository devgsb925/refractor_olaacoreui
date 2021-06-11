import { EndPoint } from './../../../security/end-point';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { IPendingShipmentTable } from '../dto/interfaces/i-pending-shipment-table';
import { IShipmentDetail } from '../components/pending-shipment/dto/interfaces/i-shipment-detail';
import { MUpdatePendingShipmentDetail } from '../components/pending-shipment/dto/model/m-update-pending-shipment-detail';
import { IReceivedShipmentTable } from '../dto/interfaces/i-received-shipment-table';
import { MUpdateReceivedShipment } from '../components/received-shipment/dto/model/m-update-received-shipment';
import { IReceivedShipment } from '../components/received-shipment/dto/interface/i-received-shipment';
import { IUidGroup } from '../components/received-shipment/dto/interface/i-uid-group';
import { MAddBarcode } from '../components/received-shipment/dto/model/m-add-barcode';
import { MDeleteUid } from '../components/received-shipment/dto/model/m-delete-uid';
import { IAddbarcodList } from '../components/received-shipment/dto/interface/i-addbarcod-list';

@Injectable()
export class StockinService {
  private loadStockinUrl = EndPoint.MainUri + 'v1/api/warehouse/stockin';
  private searchPedingShipmentUrl =
    EndPoint.MainUri + 'v1/api/warehouse/stockin/search-pending-shipment';
  private getPendingShipmentDetailsUrl =
    EndPoint.MainUri +
    'v1/api/warehouse/stockin/pending-shipment-details-by-shipment-id';
  private updatePendingShipmentUrl =
    EndPoint.MainUri + 'v1/api/warehouse/stockin/update-pending-shipment';

  private searchReceivedShipmentUrl =
    EndPoint.MainUri + 'v1/api/warehouse/stockin/serarch-recieved-shipment';

  private getReceivedShipmentDetailsUrl =
    EndPoint.MainUri +
    'v1/api/warehouse/stockin/recieved-shipment-details-by-shipment-id';

  private updateReceivedShipmentUrl =
    EndPoint.MainUri + 'v1/api/warehouse/stockin/update-recived-shipment';

  private loadBarcodeUiListUrl =
    EndPoint.MainUri + 'v1/api/warehouse/stockin/load-uid-list-by-product-id';

  private addBarcodeUrl =
    EndPoint.MainUri + 'v1/api/warehouse/stockin/add-barcode-uid';

  private onDeleteSubmitUrl =
    EndPoint.MainUri + 'v1/api/warehouse/stockin/delete-uid-by-imei-ids';

  private saveBarcodeListUrl =
    EndPoint.MainUri + 'v1/api/warehouse/stockin/add-barcode-uid-list';

  constructor(private http: HttpClient) {}

  loadAll(): Observable<any> {
    return this.http
      .get(this.loadStockinUrl)
      .pipe(catchError((err) => of(err)));
  }
  //#region pending Shipment

  searchPedingShipment(searchvalue): Observable<IPendingShipmentTable[]> {
    const params = new HttpParams().set('search', searchvalue);
    return this.http
      .get(this.searchPedingShipmentUrl, { params })
      .pipe(catchError((err) => of('server error.'))) as Observable<
      IPendingShipmentTable[]
    >;
  }

  getPendingShipmentDetails(sid: number): Observable<IShipmentDetail> {
    const params = new HttpParams().set('shipmentId', sid.toString());
    return this.http
      .get(this.getPendingShipmentDetailsUrl, { params })
      .pipe(
        catchError((err) => of('server error.'))
      ) as Observable<IShipmentDetail>;
  }

  updatePendingShipment(model: MUpdatePendingShipmentDetail): Observable<any> {
    return this.http.put(this.updatePendingShipmentUrl, model).pipe(
      take(1),
      catchError(() => of('Server Error'))
    ) as Observable<number>;
  }

  //#endregion

  //#region received shipment
  searchReceivedShipment(
    searchValue: string
  ): Observable<IReceivedShipmentTable[]> {
    const params = new HttpParams().set('search', searchValue);
    return this.http
      .get(this.searchReceivedShipmentUrl, { params })
      .pipe(catchError((err) => of('server error.'))) as Observable<
      IReceivedShipmentTable[]
    >;
  }

  getReceivedShipmentDetails(rsid: number): Observable<IReceivedShipment> {
    const params = new HttpParams().set('shipmentid', rsid.toString());
    return this.http
      .get(this.getReceivedShipmentDetailsUrl, { params })
      .pipe(
        catchError((err) => of('server error.'))
      ) as Observable<IReceivedShipment>;
  }

  onSubmitUpdateReceivedShipment(
    model: MUpdateReceivedShipment
  ): Observable<number> {
    return this.http.put(this.updateReceivedShipmentUrl, model).pipe(
      take(1),
      catchError(() => of('Server Error'))
    ) as Observable<number>;
  }

  //#endregion

  //#region barcode
  loadBarcodeUiList(productid: number): Observable<IUidGroup[]> {
    const params = new HttpParams().set('productId', productid.toString());
    return this.http
      .get(this.loadBarcodeUiListUrl, { params })
      .pipe(catchError((err) => of('server error.'))) as Observable<
      IUidGroup[]
    >;
  }

  addBarcode(model: MAddBarcode): Observable<number> {
    return this.http.post(this.addBarcodeUrl, model).pipe(
      take(1),
      catchError(() => of('Server Error'))
    ) as Observable<number>;
  }

  onDeleteSubmit(ids: MDeleteUid): Observable<number> {
    return this.http.post(this.onDeleteSubmitUrl, ids).pipe(
      take(1),
      catchError(() => of('Server Error'))
    ) as Observable<number>;
  }

  saveBarcodeList(model: IAddbarcodList): Observable<number> {
    return this.http.post(this.saveBarcodeListUrl, model).pipe(
      take(1),
      catchError(() => of('Server Error'))
    ) as Observable<number>;
  }

  //#endregion
}
