import { MAddVariant } from './interfaces/m-add-variant';
import { MAddBrand } from './interfaces/m-add-brand';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, first, share, take } from 'rxjs/operators';
import { EndPoint } from '../../../security/end-point';
import { IProductReferences } from './interfaces/i-product-references.interface';
import { IRefCouriers } from 'src/app/pages/shipment/dto/interfaces/i-ref-couriers';
import { IRefForwarders } from 'src/app/pages/shipment/dto/interfaces/i-ref-forwarder';
import { MAddModel } from './interfaces/m-add-model';
import { IVendor } from 'src/app/shared/components/vendors/i-vendor';

@Injectable()
export class ProductsReferencesService {
  public getAllProductRefUrl = EndPoint.MainUri + 'v1/api/store/references';

  private urlAddModel = 'v1/api/store/products/models/add';
  private urlAddBrand = 'v1/api/store/products/brands/add';
  private urlAddVariant = 'v1/api/store/products/variants/add';


  private urlUpdateModel =
    EndPoint.MainUri + 'v1/api/store/products/models/update';
  private urlUpdateVariant =
    EndPoint.MainUri + 'v1/api/store/products/variants/update';

  private urlGetCourier = 'v1/api/purchasing/reference/ref-couriers';
  private urlGetForwarder = 'v1/api/purchasing/reference/ref-forwarders';
  private urlQuickCreateCourier = 'v1/api/purchasing/ref-couriers/quick-add';
  private urlQuickCreateForwarder =
    'v1/api/purchasing/ref-forwarders/quick-add';
  private urlUpdateCourier = EndPoint.MainUri + 'v1/api/purchasing/ref-couriers/update';
  private urlUpdateForwarder = EndPoint.MainUri + 'v1/api/purchasing/ref-forwarders/update';



  private urlSearchVendorWithOptionPayment = EndPoint.MainUri + 'v1/api/purchasing/vendors/search-with-option-payment';


  constructor(private http: HttpClient) {}

  getAllProductRef(): Observable<IProductReferences> {
    return this.http.get(this.getAllProductRefUrl).pipe(
      take(1),
      share(),
      catchError(() => of('server error'))
    ) as Observable<IProductReferences>;
  }

  getTop100Product(): Observable<any> {
    return this.http.get(this.getAllProductRefUrl).pipe(
      share(),
      catchError(() => of('server error'))
    );
  }

  addModelToServer(model: MAddModel): Observable<number | HttpErrorResponse> {
    return this.http.post(EndPoint.MainUri + this.urlAddModel, model).pipe(
      take(1),
      catchError((res) => of(res))
    );
  }
  updateModelToServer(model: any): Observable<number>{
    return this.http.put<number>(this.urlUpdateModel, model).pipe(take(1));
  }

  addBrandToServer(model: FormData): Observable<number> {
    return this.http
      .post<number>(EndPoint.MainUri + this.urlAddBrand, model)
      .pipe(take(1));
  }


  addVariantToServer(
    model: MAddVariant
  ): Observable<number | HttpErrorResponse> {
    return this.http.post(EndPoint.MainUri + this.urlAddVariant, model).pipe(
      take(1),
      catchError((res) => of(res))
    );
  }
  updateVariantToServer(model: any): Observable<number> {
    return this.http.put<number>(this.urlUpdateVariant, model).pipe(take(1));
  }

  readCouriers(): Observable<IRefCouriers[]> {
    return this.http.get<IRefCouriers[]>(EndPoint.MainUri + this.urlGetCourier).pipe(
      take(1)
    );
  }

  readForwarders(): Observable<IRefForwarders[]> {
    return this.http.get<IRefForwarders[]>(EndPoint.MainUri + this.urlGetForwarder).pipe(
      take(1)
    );
  }

  quickCreateCourier(companyName: string, address: string): Observable<number> {
    const model = { companyName, address };
    return this.http
      .post<number>(EndPoint.MainUri + this.urlQuickCreateCourier, model)
      .pipe(
        take(1)
      );
  }

  updateCourier(refCourierId: number, companyName: string, address: string): Observable<number>{
    const model = {refCourierId, companyName, address };
    return this.http.put<number>(this.urlUpdateCourier, model).pipe(first());
  }
  quickCreateForwarder(companyName: string, address: string): Observable<number> {
    const model = { companyName, address };
    return this.http
      .post<number>(EndPoint.MainUri + this.urlQuickCreateForwarder, model)
      .pipe(
        take(1)
      );
  }
  updateForwarder(refForwarderId: number, companyName: string, address: string): Observable<number>{
    const model = {refForwarderId, companyName, address };
    return this.http.put<number>(this.urlUpdateForwarder, model).pipe(first());
  }


  searchVendorWithOptionPayment(kw: string): Observable<IVendor[]> {
    const params = new HttpParams()
      .set('kw', kw)
      // .set('option', option.toString());
    return this.http
      .get<IVendor[]>(this.urlSearchVendorWithOptionPayment, { params })
      .pipe(take(1));
  }
}
