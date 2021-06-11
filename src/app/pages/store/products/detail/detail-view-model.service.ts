import { MUpdateImageCoverLink } from './interfaces/m-update-image-cover-link';
import { MImage } from './interfaces/m-image';
import { MUpdateImageOrderIndex } from './../images/interfaces/m-update-image-order-index';
import { IImagesSource } from './../images/interfaces/i-images-source';
import { IImages } from './../images/interfaces/i-images';
import { DetailApiService } from './detail-api.service';

import { Injectable } from '@angular/core';
import { fromEventPattern, Observable } from 'rxjs';
import { IProductDetail } from './interfaces/i-product-detail';
import { HttpErrorResponse } from '@angular/common/http';
import { MUpdateProduct } from './interfaces/m-update-product';
import { EndPoint } from 'src/app/security/end-point';
import { IProductInfo } from './interfaces/i-product-info';

@Injectable()
export class DetailViewModelService {
  constructor(private detailApi: DetailApiService) {}

  private images: IImages[] = [];

  addImage(img: IImagesSource): void {

    this.images.push({
      ...img,
      url: EndPoint.MainUri + 'files/' + img.url,
      name: img.url,
    });
  }
  removeImages(ids: number[]): void {

    this.images = this.images.filter(
      (img) => !ids.includes(img.productImageId)
    );
  }



  readProductDetailFromApiById(
    id: number
  ): Observable<IProductDetail | HttpErrorResponse> {
    return this.detailApi.getProductFromApiById(id);
  }

  updateProductDetail(
    model: MUpdateProduct
  ): Observable<number | HttpErrorResponse> {
    return this.detailApi.updateProductToApi(model);
  }

  updateProductInfo(
    info: IProductInfo
  ): Observable<number | HttpErrorResponse> {
    return this.detailApi.updateProductInfoToApi(info);
  }

  readImages(id: number): Observable<IImagesSource[] | HttpErrorResponse> {
    return this.detailApi.getImagesFromApi(id);
  }

  readInfo(id: number): Observable<IProductInfo | HttpErrorResponse> {
    return this.detailApi.getInfoFromApi(id);
  }

  setImages(images: IImagesSource[]): void {
    this.images = images.map((i) => {
      return {
        ...i,
        url: EndPoint.MainUri + 'files/' + i.url,
        name: i.url,
      };
    });
  }

  setCoverLink(productImageId: number, link: string): void{
    this.images[this.images.findIndex(img => img.productImageId == productImageId)].linkCoverImageUrl = link;
  }

  checkBarcode(barcode: string): Observable<number | HttpErrorResponse> {
    return this.detailApi.getCheckBarcode(barcode);
  }

  getImages(refCatImageId: number): IImages[] {
    return this.images
      .filter((img) => img.refImageCategoryId === refCatImageId)
      .sort(this.compare);
  }

  uploadImage(image: MImage): Observable<any> {
    const formData = new FormData();
    formData.append('productId', image.productId.toString());
    formData.append('refImageCatId', image.refImageCatId.toString());
    formData.append('oldFile', image.oldFile);
    formData.append('linkCoverImageUrl', image.linkCoverImageUrl);
    formData.append('files[]', image.file);
    return this.detailApi.uploadImageToApi(formData);
  }

  uploadImages(
    productId: number,
    refProductImageCateId: number,
    files: File[]
  ): Observable<number | HttpErrorResponse> {
    const formData = new FormData();
    formData.append('productId', productId.toString());
    formData.append('refProductImageCateId', refProductImageCateId.toString());
    files.forEach((f) => {
      formData.append('files[]', f);
    });

    return this.detailApi.uploadImagesToImages(formData);
  }

  removeImage(id: number): void {
    this.images = this.images.filter((img) => img.productImageId !== id);
  }

  deleteImages(ids: number[]): Observable<number | HttpErrorResponse> {
    return this.detailApi.deleteImagesFromApi(ids);
  }

  updateInstanceImages(images: IImages[]): void {
    this.images = this.images.filter(
      (img) =>
        !images.map((id) => id.productImageId).includes(img.productImageId)
    );
    this.images = this.images.concat(images);
  }

  updateImagesOrderIndex(
    data: MUpdateImageOrderIndex[]
  ): Observable<number | HttpErrorResponse> {
    return this.detailApi.updateImageOrderIndex(data);
  }

  updateImageCoverLink(
    data: MUpdateImageCoverLink[]
  ): Observable<number | HttpErrorResponse>{
    return this.detailApi.updateCoverImageLink(data);
  }

  compare(a: IImages, b: IImages): number {
    if (a.orderIndex < b.orderIndex) {
      return -1;
    }
    if (a.orderIndex > b.orderIndex) {
      return 1;
    }
    return 0;
  }

  updateIndexOfImages(id: number, value: number, index: number): void {
    let imgs = this.getImages(index);


    if (imgs.find((c) => c.orderIndex === value) !== undefined) {
      const current = imgs.find((f) => f.productImageId === id);
      if (current.orderIndex > value) {
        const orderIndexs = imgs
          .map((img) => img.orderIndex)
          .filter((oi) => oi > value);
        const tempImgs = imgs.filter(
          (img) => img.orderIndex >= value && img.productImageId !== id
        );

        for (let i = 0; i < orderIndexs.length; i++) {
          tempImgs[i].orderIndex = orderIndexs[i];
        }
        imgs = imgs.filter(
          (img) =>
            !tempImgs.map((i) => i.productImageId).includes(img.productImageId)
        );
        imgs = imgs.concat(tempImgs);

        imgs[imgs.findIndex((c) => c.productImageId === id)].orderIndex = value;
        this.updateInstanceImages(imgs);
      } else {
        const orderIndexs = imgs
          .map((img) => img.orderIndex)
          .filter((oi) => oi >= current.orderIndex && oi !== value);

        const tempImgs = imgs.filter(
          (img) => img.orderIndex > current.orderIndex
        );

        for (let i = 0; i < orderIndexs.length; i++) {
          tempImgs[i].orderIndex = orderIndexs[i];
        }
        imgs = imgs.filter(
          (img) =>
            !tempImgs.map((i) => i.productImageId).includes(img.productImageId)
        );
        imgs = imgs.concat(tempImgs);
        imgs[imgs.findIndex((c) => c.productImageId === id)].orderIndex = value;
        this.updateInstanceImages(imgs);
      }
    } else {
      imgs[imgs.findIndex((c) => c.productImageId === id)].orderIndex = value;
    }
  }
}
