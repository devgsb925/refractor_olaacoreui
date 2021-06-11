import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { EndPoint } from '../../../../security/end-point';
import { MInvoiceList } from '../interfaces/m-invoice-list';

@Injectable()
export class SalesOrderService {
  constructor(private http: HttpClient) {}

  private invoiceListUrl = EndPoint.MainUri + 'v1/api/reports/sales-report/invoice-list';

  private operatorsUrl = EndPoint.MainUri + 'v1/api/reports/shift-report/operators'

  invoiceList(model: MInvoiceList): Observable<any> {
    return this.http
      .post(this.invoiceListUrl, model)
      .pipe(catchError((err) => of('server error.')));
  }

  getOperators(): Observable<any> {
    return this.http
      .get(this.operatorsUrl)
      .pipe(catchError((err) => of('server error.')));
  }
}
