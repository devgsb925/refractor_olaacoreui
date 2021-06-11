import { MUpdateImageCoverLink } from './interfaces/m-update-image-cover-link';
import { IProductInfo } from './interfaces/i-product-info';
import { MUpdateImageOrderIndex } from './../images/interfaces/m-update-image-order-index';
import { IImagesSource } from './../images/interfaces/i-images-source';
import { MUpdateProduct } from './interfaces/m-update-product';
import { IProductDetail } from './interfaces/i-product-detail';
import { take, catchError } from 'rxjs/operators';
import { EndPoint } from 'src/app/security/end-point';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class DetailApiService {
  constructor(private http: HttpClient) {}

  private urlGetProduct = 'v1/api/store/products/product-details-by-product-id';

  private urlGetImages = 'v1/api/store/products/image/product-image-by-product-id';

  private urlGetInfo = 'v1/api/store/products/details';



  private urlUpdateProduct = 'v1/api/store/products/full-update-product';

  private urlUpdateProductInfo = 'v1/api/store/products/details/update';

  private urlUploadImg = 'v1/api/store/products/image/upload';
  // FormData productId, refProductImageCateId

  private urlDeleteImg = 'v1/api/store/products/image/delete';
  private urlDeleteImgs = 'v1/api/store/products/image/delete-list';
  // param did: number

  private urlUpdateOrderIndex = 'v1/api/store/products/image/update-order-index';
  private urlCheckBarcode = 'v1/api/store/products/validate-barcode';
  private urlUpdateCoverLink = 'v1/api/store/products/image/update-cover-link';

  getProductFromApiById(id: number): Observable<IProductDetail | HttpErrorResponse> {
    const params = new HttpParams().set('productId', id.toString());
    return this.http
      .get(EndPoint.MainUri + this.urlGetProduct, { params })
      .pipe(
        take(1),
        catchError(res => of(res))
      ) as Observable<IProductDetail | HttpErrorResponse>;
  }

  updateProductToApi(product: MUpdateProduct): Observable<number>{
    return this.http
      .put(EndPoint.MainUri + this.urlUpdateProduct, product)
      .pipe(
        take(1),
        catchError(res => of(res))
      ) as Observable<number>;
  }

  updateProductInfoToApi(info: IProductInfo): Observable<number | HttpErrorResponse>{
    return this.http
      .put(EndPoint.MainUri + this.urlUpdateProductInfo, info).pipe(
        take(1),
        catchError(res => of(res))
      );
  }



  getImagesFromApi(id: number): Observable<IImagesSource[] | HttpErrorResponse>{

    const params = new HttpParams().set('productId', id.toString());
    return this.http.get(EndPoint.MainUri + this.urlGetImages, {params}).pipe(
      take(1),
      catchError(res => of(res))
    );
  }


  getInfoFromApi(id: number): Observable<IProductInfo | HttpErrorResponse>{
    const params = new HttpParams().set('productId', id.toString());
    return this.http.get(EndPoint.MainUri + this.urlGetInfo, { params }).pipe(
      take(1),
      catchError(res => of(res))
    );
  }

  getCheckBarcode(barcode: string): Observable<number | HttpErrorResponse>{
    const params = new HttpParams().set('barcode', barcode);
    return this.http.get(EndPoint.MainUri + this.urlCheckBarcode, { params }).pipe(
      take(1),
      catchError(res => of(res))
    );
  }

  uploadImageToApi(formData: FormData): Observable<any>{
    return this.http.post(EndPoint.MainUri + this.urlUploadImg, formData, { observe: 'events', reportProgress: true });
  }

  uploadImagesToImages(formData: FormData): Observable<number | HttpErrorResponse>{
    return this.http.post(EndPoint.MainUri + this.urlUploadImg, formData).pipe(
      take(1),
      catchError(res => of(res))
    );
  }


  deleteImageFromApi(id: number): Observable<number | HttpErrorResponse>{
    const params = new HttpParams().set('did', id.toString());
    return this.http.delete(EndPoint.MainUri + this.urlDeleteImg, {params}).pipe(
      take(1),
      catchError(res => of(res))
    );
  }

  deleteImagesFromApi(ids: number[]): Observable<number | HttpErrorResponse>{
    const model = { dids: ids };
    return this.http.post(EndPoint.MainUri + this.urlDeleteImgs, model).pipe(
      take(1),
      catchError(res => of(res))
    );
  }

  updateImageOrderIndex(data: MUpdateImageOrderIndex[]): Observable<number | HttpErrorResponse>{
    const model = { orderIndexList: data };
    return this.http.put(EndPoint.MainUri + this.urlUpdateOrderIndex, model).pipe(
      take(1),
      catchError(res => of(res))
    );
  }

  updateCoverImageLink(data: MUpdateImageCoverLink[]): Observable<number | HttpErrorResponse>{
    const model = { coverLinkList: data };
    return this.http.put(EndPoint.MainUri + this.urlUpdateCoverLink, model).pipe(
      take(1),
      catchError(res => of(res))
    );
  }
}
