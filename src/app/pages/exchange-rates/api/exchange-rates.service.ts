import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EndPoint } from '../../../security/end-point';
import { IUpdateExchangeRate } from '../dto/model/i-update-exchange-rate';
import { IAddExchangeRate } from '../dto/model/i-add-exchange-rate';
import { IExchangeRate } from '../dto/interfaces/i-exchange-rate';
import { take } from 'rxjs/operators';

@Injectable()
export class ExchangeRatesService {
  public addExchangeRateUrl =
    EndPoint.MainUri + 'v1/api/purchasing/exchange-rates/add';
  public updateExchangeRateUrl =
    EndPoint.MainUri + 'v1/api/purchasing/exchange-rates/update';

  public searchExchangeRateUrl =
    EndPoint.MainUri + 'v1/api/purchasing/exchange-rates/search';

  constructor(private http: HttpClient) {}

  add(model: IAddExchangeRate): Observable<number> {
    return this.http.post<number>(this.addExchangeRateUrl, model).pipe(take(1));
  }

  update(model: IUpdateExchangeRate): Observable<number> {
    return this.http
      .put<number>(this.updateExchangeRateUrl, model)
      .pipe(take(1));
  }

  searchExchangeRate(
    searchValue: string,
    type: number
  ): Observable<IExchangeRate[]> {
    const params = new HttpParams()
      .set('search', searchValue)
      .set('type', type.toString());
    return this.http
      .get<IExchangeRate[]>(this.searchExchangeRateUrl, { params })
      .pipe(take(1));
  }
}
