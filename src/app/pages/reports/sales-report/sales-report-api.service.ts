import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { take, catchError } from 'rxjs/operators';
import { EndPoint } from 'src/app/security/end-point';
import {IInvoiceSummaryParams} from './interfaces/i-invoice-summary-params';
import { IProductSummaryParams } from './interfaces/i-product-summary-params';
import { IGetStock } from './stock-report/interface/i-get-stock';
@Injectable()
export class SalesReportApiService {

  constructor(private http: HttpClient) {}

  private invoiceReportUrl = 'v1/api/reports/sales-report/invoice-reports';
  private productReportUrl = 'v1/api/reports/sales-report/product-reports';
  private getCategoriesUrl = 'v1/api/store/references/categories';
  private getBrandUrl = 'v1/api/store/references/brands';
  private getOperatorsUrl = 'v1/api/reports/shift-report/operators';
  private getInvoiceDetailByInvoiceIdUrl = 'v1/api/pos/invoice-details-by-id';
  private getStockReportUrl = 'v1/api/reports/sales-report/stock-report';


  getOperators(): Observable<any> {

    return this.http
      .get(EndPoint.MainUri + this.getOperatorsUrl)
      .pipe(
        take(1),
        catchError((err) => of('server error.'))
      );
  }

  getCategories(kw: string): Observable<any> {

    let params = new HttpParams()


    params = params.append('kw', kw);

    return this.http
      .get(EndPoint.MainUri + this.getCategoriesUrl, { params: params })
      .pipe(
        take(1),
        catchError((err) => of('server error.'))
      );
  }

  getBrand(kw: string): Observable<any> {

    let params = new HttpParams()


    params = params.append('kw', kw);

    return this.http
      .get(EndPoint.MainUri + this.getBrandUrl, { params: params })
      .pipe(
        take(1),
        catchError((err) => of('server error.'))
      );
  }

  invoiceReport(model:IInvoiceSummaryParams): Observable<any> {

    return this.http
      .post(EndPoint.MainUri + this.invoiceReportUrl, model)
      .pipe(
        take(1),
        catchError((err) => of('server error.'))
      );
  }

  productReport(model : IProductSummaryParams): Observable<any> {

    let params = new HttpParams()
    params = params.append('fromDate', model.fromDate.toISOString());
    params = params.append('toDate', model.toDate.toISOString());
    params = params.append('kw', model.kw);
    params = params.append('categoryId', model.categoryId.toString());
    params = params.append('brandId', model.brandId.toString());
    params = params.append('transactionType', model.transactionType);

    return this.http
      .get(EndPoint.MainUri + this.productReportUrl, { params: params })
      .pipe(
        take(1),
        catchError((err) => of('server error.'))
      );
  }


  stockReport(model: IGetStock): Observable<any> {

    let params = new HttpParams()
    params = params.append('kw', model.kw);
    params = params.append('brandId', model.brandId.toString());
    params = params.append('categoryId', model.categoryId.toString());

    return this.http
      .get(EndPoint.MainUri + this.getStockReportUrl, { params: params })
      .pipe(
        take(1),
        catchError((err) => of('server error.'))
      );
  }


  getInvoiceDetailByInvoiceId(inv: number): Observable<any> {

    let params = new HttpParams()


    params = params.append('invoiceId', inv.toString());

    return this.http
      .get(EndPoint.MainUri + this.getInvoiceDetailByInvoiceIdUrl, { params: params })
      .pipe(
        take(1),
        catchError((err) => of('server error.'))
      );
  }




}
