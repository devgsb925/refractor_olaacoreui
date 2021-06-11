import { MAddProduct } from './interfaces/m-add-product';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { EndPoint } from 'src/app/security/end-point';

@Injectable()
export class AddProductApiService {

  constructor(private http: HttpClient) { }

  private urlCheckBarcode = 'v1/api/store/products/validate-barcode';
  private urlAddNewProduct = 'v1/api/store/products/add-product-with-stock';
  addNewProduct(model: MAddProduct): Observable<number> {
    return this.http.post(EndPoint.MainUri + this.urlAddNewProduct, model).pipe(
      take(1),
      catchError((res) => of(res))
    ) as Observable<number>;
  }
  getCheckBarcode(barcode: string): Observable<number | HttpErrorResponse>{
    const params = new HttpParams().set('barcode', barcode);
    return this.http.get(EndPoint.MainUri + this.urlCheckBarcode, { params }).pipe(
      take(1),
      catchError(res => of(res))
    );
  }
}
