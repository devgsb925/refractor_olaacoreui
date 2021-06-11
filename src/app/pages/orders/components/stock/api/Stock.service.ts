import { MAddPendinOrder } from './../dto/model/m-add-pendin-order';
import { EndPoint } from '../../../../../security/end-point';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { IProductInventory } from '../dto/interface/i-product-inventory';

@Injectable()
export class StockService {
  constructor(private http: HttpClient) {}

  private urlGetList =
    EndPoint.MainUri + 'v1/api/store/stocks/product-inventories/get-list';


  private updaetProductStockUrl =
    EndPoint.MainUri + 'v1/api/store/stocks/update';
  private addpendingOrderUrl =
    EndPoint.MainUri + 'v1/api/purchasing/pending-orders/add';

  getList(
    kw: string,
    skip: number,
    count: number
  ): Observable<IProductInventory[]> {
    const params = new HttpParams()
      .append('kw', kw.toLowerCase())
      .append('skip', skip.toString())
      .append('count', count.toString());
    return this.http
      .get<IProductInventory[]>(this.urlGetList, { params })
      .pipe(take(1));
  }



  updateProductStock(model): Observable<number> {
    return this.http
      .put(this.updaetProductStockUrl, model)
      .pipe(catchError(() => of('server error'))) as Observable<number>;
  }

  addpendingOrder(model: MAddPendinOrder): Observable<any> {
    return this.http
      .post(this.addpendingOrderUrl, model)
      .pipe(catchError(() => of('server error'))) as Observable<any>;
  }


}
