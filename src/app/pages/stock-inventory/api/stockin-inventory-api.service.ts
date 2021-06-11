import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { EndPoint } from 'src/app/security/end-point';
import { IEditInventory } from '../components/edit-stockin-history/dto/interfaces/i-edit-inventory';
import { ISaveEdit } from '../components/edit-stockin-history/dto/model/i-save-edit';
import { IInventoryHistory } from '../components/inventory-history/interface/i-inventory-history';
import { IOperator } from '../components/inventory-history/interface/i-operator'

@Injectable()
export class StockinInventoryApiService {

  private getInventoryUrl = EndPoint.MainUri + 'api/stock-inventory/history';
  private getOperatorUrl = EndPoint.MainUri + 'api/stock-inventory/get-operators';
  private addHistoryUrl = EndPoint.MainUri + 'api/stock-inventory/add';
  private editInventoryHistoryUrl = EndPoint.MainUri + '';
  private getEditInventoryUrl = EndPoint.MainUri + 'api/stock-inventory/get-inventory-by-inventory-date-with-id';
  constructor(private http: HttpClient) { }

  getInventory(): Observable<IInventoryHistory[]> {
    return this.http.get(this.getInventoryUrl).pipe(
      catchError((err) => of('server error.'))
    ) as Observable<IInventoryHistory[]>
  }

  getOperator(): Observable<IOperator[]> {
    return this.http.get(this.getOperatorUrl).pipe(
      catchError((err) => of('server error'))
    ) as Observable<IOperator[]>
  }

  addInventoryHistory(model:{operatorId: number}): Observable<IInventoryHistory> {

    return this.http.post(this.addHistoryUrl, model).pipe(
      catchError((err) => of('server error.'))
    ) as Observable<IInventoryHistory>
  }

  editInventoryHistory(model: ISaveEdit): Observable<any> {
    return this.http.put(this.editInventoryHistoryUrl, model).pipe(
      catchError((err) => of('server error'))
      ) as Observable<any>
  }

  getEditInventory(model:{inventoryDate: Date; OperatorId: number}): Observable<any>{
    const params = new HttpParams()
    .set('inventoryDate', model.inventoryDate.toString())
    .set('operatorId', model.OperatorId.toString());
    return this.http.get(this.getEditInventoryUrl,{params: params}).pipe(
      catchError((err) => of('server error'))
    )as Observable<any>
  }

}
