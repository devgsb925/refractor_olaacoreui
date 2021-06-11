import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { EndPoint } from 'src/app/security/end-point';
import { IProduct } from '../dto/interfaces/I-product';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IUid } from '../dto/interfaces/i-uid';
import { MAddBarcode } from '../dto/model/m-add-barcode';
import { MDeleteUid } from '../dto/model/m-delete-uid';

@Injectable()
export class BarcodeManagerApiService {
  private searchProductUrl =
    EndPoint.MainUri +
    'v1/api/warehouse/stockin/barcode-management/search-proudcts';
  private loadBarcodeUiListUrl =
    EndPoint.MainUri + 'v1/api/warehouse/stockin/load-uid-list-by-product-id';

  private addBarcodeUrl = EndPoint.MainUri + 'v1/api/warehouse/stockin/add-barcode-uid';
  private onDeleteSubmitUrl = EndPoint.MainUri + 'v1/api/warehouse/stockin/delete-uid-by-imei-ids';

  constructor(private http: HttpClient) {}

  searchProduct(search: string): Observable<IProduct[]> {
    const params = new HttpParams().set('search', search);
    return this.http
      .get(this.searchProductUrl, { params })
      .pipe(catchError((err) => of('server error.'))) as Observable<IProduct[]>;
  }

  loadBarcodeUiList(productid: number): Observable<IUid[]> {
    const params = new HttpParams().set('productId', productid.toString());
    return this.http
      .get(this.loadBarcodeUiListUrl, { params })
      .pipe(catchError((err) => of('server error.'))) as Observable<IUid[]>;
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
}
