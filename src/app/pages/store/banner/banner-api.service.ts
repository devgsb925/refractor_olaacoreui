import { IUpdateCategory } from './interfaces/i-update-category';
import { IUpdateBanner } from './interfaces/i-update-banner';
import { IRefBanner } from './interfaces/i-ref-banner';
import { IBannerDataContainer } from './interfaces/i-banner-data-container';
import { EndPoint } from 'src/app/security/end-point';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class BannerApiService {
  constructor(private http: HttpClient) {}

  private urlBannerReference = 'v1/api/store/banners/references';
  private urlBannerImage = 'v1/api/store/banners/images';
  private urlUpdateBannerDetails = 'v1/api/store/banners/update-banner-details';
  private urlDeleteCategoryImage = 'v1/api/store/banners/delete-category-image';
  private urlDeleteBanners = 'v1/api/store/banners/delete-banners';
  private urlUploadBanners = 'v1/api/store/banners/upload';

  getBannerReference(): Observable<IRefBanner[]> {
    return this.http.get<IRefBanner[]>(EndPoint.MainUri + this.urlBannerReference).pipe(
      take(1)
    );
  }

  getBannerDataContainer(): Observable<IBannerDataContainer> {
    return this.http.get<IBannerDataContainer>(EndPoint.MainUri + this.urlBannerImage).pipe(
      take(1)
    );
  }

  updateBannerDetail(
    updateBanners: IUpdateBanner[],
    updateCategories: IUpdateCategory[]
  ): Observable<number> {
    const model = { updateBanners, updateCategories };
    return this.http
      .put<number>(EndPoint.MainUri + this.urlUpdateBannerDetails, model)
      .pipe(
        take(1)
      );
  }

  deleteCategoryImage(id: number): Observable<number> {
    const params = new HttpParams().set('id', id.toString());
    return this.http
      .delete<number>(EndPoint.MainUri + this.urlDeleteCategoryImage, { params })
      .pipe(
        take(1)
      );
  }

  deleteBanners(delIds: number[]): Observable<number> {
    const model = { delIds };
    return this.http.post<number>(EndPoint.MainUri + this.urlDeleteBanners, model).pipe(
      take(1)
    );
  }

  uploadBanners(formData: FormData): Observable<any> {
    return this.http.post(EndPoint.MainUri + this.urlUploadBanners, formData, {
      observe: 'events',
      reportProgress: true,
    });
  }
}
