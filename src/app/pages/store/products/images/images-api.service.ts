import { MUpdateImageOrderIndex } from './interfaces/m-update-image-order-index';
import { EndPoint } from 'src/app/security/end-point';
import { IImagesSource } from './interfaces/i-images-source';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, take } from 'rxjs/operators';

@Injectable()
export class ImagesApiService {

  constructor(private http: HttpClient) { }

  private urlGetImages = 'v1/api/store/products/image/product-image-by-product-id';



  private urlUploadImg = 'v1/api/store/products/image/upload';
  // FormData productId, refProductImageCateId

  private urlDeleteImg = 'v1/api/store/products/image/delete';
  // param did: number

  private urlUpdateOrderIndex = 'v1/api/store/products/image/update-order-index';

  getImagesFromApi(id: number): Observable<IImagesSource[] | HttpErrorResponse>{

    const params = new HttpParams().set('productId', id.toString());
    return this.http.get(EndPoint.MainUri + this.urlGetImages, {params}).pipe(
      take(1),
      catchError(res => of(res))
    );
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

  updateImageOrderIndex(data: MUpdateImageOrderIndex[]): Observable<number | HttpErrorResponse>{
    const model = { orderIndexList: data };
    return this.http.put(EndPoint.MainUri + this.urlUpdateOrderIndex, model).pipe(
      take(1),
      catchError(res => of(res))
    );
  }
}
