import { MUpdateImageOrderIndex } from './interfaces/m-update-image-order-index';
import { EndPoint } from './../../../../security/end-point';
import { ImagesApiService } from './images-api.service';
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { IImagesSource } from './interfaces/i-images-source';
import { Observable } from 'rxjs';
import { IImages } from './interfaces/i-images';

@Injectable()
export class ImagesViewModelService {
  constructor(private imagesApi: ImagesApiService) {}

  private images: IImages[] = [];

  readImages(id: number): Observable<IImagesSource[] | HttpErrorResponse> {
    return this.imagesApi.getImagesFromApi(id);
  }

  setImages(images: IImagesSource[]): void {
    this.images = images.map(i => {
      return {
        ...i,
        url: EndPoint.MainUri + 'files/' + i.url,
        name: i.url
      };
    });
  }

  getCovers(): IImages[] {
    return this.images.filter((img) => img.refImageCategoryId ===  1).sort(this.compare);
  }

  getOverviews(): IImages[] {
    return this.images.filter((img) => img.refImageCategoryId === 4).sort(this.compare);
  }

  uploadImages(
    productId: number,
    refProductImageCateId: number,
    files: File[]
  ): Observable<number | HttpErrorResponse> {
    const formData = new FormData();
    formData.append('productId', productId.toString());
    formData.append('refProductImageCateId', refProductImageCateId.toString());
    files.forEach(f => {
      formData.append('files[]', f);
    });


    return this.imagesApi.uploadImagesToImages(formData);
  }

  removeImage(id: number): void{
    this.images = this.images.filter(img => img.productImageId !== id);
  }


  deleteImages(id: number): Observable<number | HttpErrorResponse>
  {
    return this.imagesApi.deleteImageFromApi(id);
  }

  updateInstanceImages(images: IImages[]): void{
    this.images = this.images.filter(img => !images.map(id => id.productImageId).includes(img.productImageId));
    this.images = this.images.concat(images);
  }

  updateImagesOrderIndex(): Observable<number | HttpErrorResponse>{
    const data: MUpdateImageOrderIndex[] = this.images.map(img => {
      return {
        ...img
      };
    });
    return this.imagesApi.updateImageOrderIndex(data);
  }

  compare( a: IImages, b: IImages ): number {
    if ( a.orderIndex < b.orderIndex ){
      return -1;
    }
    if ( a.orderIndex > b.orderIndex ){
      return 1;
    }
    return 0;
  }
}
