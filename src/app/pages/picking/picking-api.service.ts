import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { EndPoint } from 'src/app/security/end-point';
import { IPicking } from './interfaces/i-picking';
import { IWithDraw } from './interfaces/i-withdraw';

@Injectable()
export class PickingApiService {
  constructor(private http: HttpClient) {}

  // private urlApiGetWithdraw =
  //   'v1/api/warehouse/withdrawals/all-withdrawals-incommplete';
  private urlApiGetWithdrewToday = 'v1/api/warehouse/withdrawals/today';
  private urlApiGetPickingToday = 'v1/api/warehouse/picking/today';



  private urlApiGetPicking = 'v1/api/warehouse/picking/all-pickings';
  private urlApiAddPicking = 'v1/api/warehouse/picking/add-picking';
  private urlApiUpdateWithdraw =
    'v1/api/warehouse/withdrawals/update-withdrawals';
  private urlApiUpdatePicking = 'v1/api/warehouse/picking/update-picking';

  getWithdraw(): Observable<IWithDraw[] | HttpErrorResponse> {
    return this.http.get(EndPoint.MainUri + this.urlApiGetWithdrewToday).pipe(
      take(1),
      catchError((res) => of(res))
    );
  }

  getPicking(): Observable<IPicking[] | HttpErrorResponse> {
    return this.http.get(EndPoint.MainUri + this.urlApiGetPickingToday).pipe(
      take(1),
      catchError((res) => of(res))
    );
  }

  addPicking(model) {
    return this.http.post(EndPoint.MainUri + this.urlApiAddPicking, model).pipe(
      take(1),
      catchError(() => of('Server Error'))
    );
  }

  updateQtyOfWithdraw(withdrawId: number, qty: number) {
    const model = {
      withdrawals: [
        {
          warehouseWithdrawalId: withdrawId,
          withdrawalStatus: 1,
          qty,
        },
      ],
    };

    this.http.put(EndPoint.MainUri + this.urlApiUpdateWithdraw, model).pipe(
      take(1),
      catchError(() => of('Server Error'))
    );
  }

  updateQtyWithdraw(model): Observable<any> {
    return this.http
      .put(EndPoint.MainUri + this.urlApiUpdateWithdraw, model)
      .pipe(
        take(1),
        catchError(() => of('Server Error'))
      );
  }

  updatePickingState(model): Observable<any> {
    return this.http
      .put(EndPoint.MainUri + this.urlApiUpdatePicking, model)
      .pipe(
        take(1),
        catchError(() => of('Server Error'))
      );
  }
}
