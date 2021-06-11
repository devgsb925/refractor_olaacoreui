import { MUpdateImageCoverLink } from './../../interfaces/m-update-image-cover-link';
import { EndPoint } from 'src/app/security/end-point';
import { IProductInfo } from './../../interfaces/i-product-info';
import { MUpdateImageOrderIndex } from './../../../images/interfaces/m-update-image-order-index';
import { IImageFile } from './../../interfaces/i-image-file';
import { MImage } from './../../interfaces/m-image';
import {
  debounceTime,
  map,
  switchMap,
  catchError,
  concatMap,
} from 'rxjs/operators';
import { IImages } from './../../../images/interfaces/i-images';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { DetailViewModelService } from './../../detail-view-model.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject, of } from 'rxjs';

@Component({
  selector: 'app-product-content',
  templateUrl: './product-content.component.html',
  styleUrls: ['./product-content.component.scss'],
})
export class ProductContentComponent implements OnInit, OnDestroy {
  constructor(
    private routerSnapshot: ActivatedRoute,
    public detailViewModel: DetailViewModelService
  ) {}

  tabPos = 0;
  productId = 0;
  hasUpdate = false;

  productDetailId = 0;
  information = '';
  specifications = '';
  link1Desc = '';
  link2Desc = '';
  link3Desc = '';
  url1 = '';
  url2 = '';
  url3 = '';
  inTheBox = '';

  selectItem: IImages = null;
  selectErrorItem: IImageFile = null;

  hoverthumbnailIndex = -1;
  hoverCoverIndex = -1;
  hoverOverviewIndex = -1;
  hoverSpecImageIndex = -1;
  startIndex = -1;

  productImageIdSelectId = 0;
  pendingthumbnailSelectId = 0;

  specImageSelectIds: number[] = [];
  thumbnailSelectIds: number[] = [];
  coverSelectIds: number[] = [];
  overviewSelectIds: number[] = [];

  pendingFiles: IImageFile[] = [];
  errorFiles: IImageFile[] = [];

  coverHasChangeIndex = false;
  overviewHasChangeIndex = false;
  thumbnailHasChangeIndex = false;
  specImageHasChangeIndex = false;

  private updateProductInfoSubject = new Subject<IProductInfo>();
  private uploadProductSubject = new Subject<MImage>();
  private updateCoverLinkSubject = new Subject<MUpdateImageCoverLink[]>();
  private orderIndexSubject = new Subject<MUpdateImageOrderIndex[]>();
  private subscription = new Subscription();

  ngOnInit(): void {
    this.productId = parseInt(
      this.routerSnapshot.snapshot.paramMap.get('id'),
      10
    );

    const productImageSub = this.detailViewModel
      .readImages(this.productId)
      .subscribe((res) => {
        if (
          !(res instanceof HttpErrorResponse) &&
          res !== undefined &&
          res !== null
        ) {
          this.detailViewModel.setImages(res);
        } else {
          if (res !== null) {
            const errorRes = res as HttpErrorResponse;
            alert(errorRes.error.text);
          } else {
            alert('Has Some problem! Please try again');
          }
        }
      });

    this.subscription.add(productImageSub);

    const productInfoSub = this.detailViewModel
      .readInfo(this.productId)
      .subscribe((res) => {
        if (!(res instanceof HttpErrorResponse) && res !== null) {
          this.productDetailId = res.productDetailId;
          this.information = res.info;
          this.specifications = res.spec;
          this.inTheBox = res.inthebox;
          this.link1Desc = res.link1;
          this.link2Desc = res.link2;
          this.link3Desc = res.link3;
          this.url1 = res.url1;
          this.url2 = res.url2;
          this.url3 = res.url3;
        }
      });
    this.subscription.add(productInfoSub);
    this.initUpdateInfo();
    this.initUpdateOrderIndex();
    this.initUpdateCoverLinkInfo();
    this.initUploadImage();
  }

  ngOnDestroy(): void {
    this.detailViewModel.setImages([]);
    this.subscription?.unsubscribe();
  }

  initUpdateInfo(): void {

    const productUpdateInfo = this.updateProductInfoSubject
      .pipe(
        switchMap((res) => {
          return this.detailViewModel.updateProductInfo(res);
        })
      )
      .subscribe((res) => {
        if (typeof res === 'number') {
          if (res > 0) {
            alert('Update information complete!!');
          }
        } else if (res !== null) {
          const errorRes = res as HttpErrorResponse;
          alert(errorRes.error.text);
          console.log(res);
        }
        this.updateOrderIndex();
      });
    this.subscription.add(productUpdateInfo);
  }

  initUpdateCoverLinkInfo(): void {
    const updateCoverLinkSub = this.updateCoverLinkSubject
      .pipe(
        switchMap((res) => {
          return this.detailViewModel.updateImageCoverLink(res);
        })
      )
      .subscribe((res) => {
        if (typeof res === 'number' && res > 0) {
          alert('Update Cover Link complete!!');
          this.thumbnailSelectIds = [];
        }
        this.uploadImage();
      });
    this.subscription.add(updateCoverLinkSub);
  }

  initUploadImage(): void {
    const uploadSub = this.uploadProductSubject
      .pipe(
        concatMap((res) => {
          return this.detailViewModel.uploadImage(res);
        }),
        catchError((res) => {
          return of(res);
        }),
        map((event) => {
          if (event instanceof HttpResponse) {
            return event.body;
          } else if (event instanceof HttpErrorResponse) {
            return event;
          } else {
            if (
              event.type > 0 &&
              event.total !== undefined &&
              this.pendingFiles[0] !== undefined
            ) {
              this.pendingFiles[0].progress = Math.round(
                (100 * event.loaded) / event.total
              );
              return 'inprocess';
            } else {
              return event;
            }
          }
        }),
        debounceTime(500)
      )
      .subscribe((res) => {
        if (
          res !== undefined &&
          !(res instanceof HttpErrorResponse) &&
          typeof res !== 'string'
        ) {
          if (res > 0) {
            const pendingFile = this.pendingFiles[0];
            if (pendingFile.refImageCatId === 5 && this.detailViewModel.getImages(5).length > 0) {
              this.detailViewModel.removeImages([
                this.detailViewModel.getImages(5)[0].productImageId,
              ]);
            }

            this.detailViewModel.addImage({
              productImageId: res,
              productId: this.productId,
              url: pendingFile.file.name,
              refImageCategoryId: pendingFile.refImageCatId,
              orderIndex:
                this.detailViewModel.getImages(pendingFile.refImageCatId)
                  .length > 0
                  ? this.detailViewModel.getImages(pendingFile.refImageCatId)[
                      this.detailViewModel.getImages(pendingFile.refImageCatId)
                        .length - 1
                    ].orderIndex + 1
                  : 1,
              linkCoverImageUrl: pendingFile.linkCoverImageUrl,
            });

            this.removeFirstPendingListAndTryUpload();
          } else {
            this.errorFiles.push(this.pendingFiles[0]);
            this.removeFirstPendingListAndTryUpload();
          }
        } else if (res instanceof HttpErrorResponse) {
          this.errorFiles.push(this.pendingFiles[0]);
          this.removeFirstPendingListAndTryUpload();
        } else if (typeof res !== 'string') {
          this.removeFirstPendingListAndTryUpload();
        }
      });
    this.subscription.add(uploadSub);
  }

  initUpdateOrderIndex(): void {
    const updateOrderIndexSub = this.orderIndexSubject
      .pipe(
        switchMap((res) => {
          return this.detailViewModel.updateImagesOrderIndex(res);
        })
      )
      .subscribe(() => {
        this.coverHasChangeIndex = false;
        this.overviewHasChangeIndex = false;
        this.thumbnailHasChangeIndex = false;
        alert('update order-index success');
        this.updateCoverLink();
      });
    this.subscription.add(updateOrderIndexSub);
  }

  removeFirstPendingListAndTryUpload(): void {
    this.pendingFiles.splice(0, 1);

    if (this.pendingFiles[0] !== undefined) {
      this.uploadProductSubject.next({
        productId: this.productId,
        refImageCatId: this.pendingFiles[0].refImageCatId,
        file: this.pendingFiles[0].file,
        oldFile: this.pendingFiles[0].oldFile,
        linkCoverImageUrl: this.pendingFiles[0].linkCoverImageUrl,
      });
    }
  }

  saveFunc(): void {
    const info: IProductInfo = {
      productDetailId: this.productDetailId,
      productId: this.productId,
      info: this.information,
      inthebox: this.inTheBox,
      spec: this.specifications,
      link1: this.link1Desc,
      link2: this.link2Desc,
      link3: this.link3Desc,
      url1: this.url1,
      url2: this.url2,
      url3: this.url3,
    };
    this.updateProductInfoSubject.next(info);
  }

  updateCoverLink(): void {
    if (this.thumbnailSelectIds.length > 0) {
      const coverLinkList: MUpdateImageCoverLink[] = this.detailViewModel
        .getImages(2)
        .filter((img) => this.thumbnailSelectIds.includes(img.productImageId))
        .map((img) => {
          return {
            productImageId: img.productImageId,
            linkCoverImageUrl: img.linkCoverImageUrl,
          };
        });

      this.updateCoverLinkSubject.next(coverLinkList);
    } else {
      this.uploadImage();
    }
  }

  updateOrderIndex(): void {
    if (
      this.coverHasChangeIndex ||
      this.overviewHasChangeIndex ||
      this.specImageHasChangeIndex
    ) {
      let orderIndexs: MUpdateImageOrderIndex[] = [];
      if (this.coverHasChangeIndex) {
        orderIndexs = orderIndexs.concat(
          this.detailViewModel.getImages(1).map((cover) => {
            return {
              productImageId: cover.productImageId,
              orderIndex: cover.orderIndex,
            };
          })
        );
      }
      if (this.overviewHasChangeIndex) {
        orderIndexs = orderIndexs.concat(
          this.detailViewModel.getImages(4).map((cover) => {
            return {
              productImageId: cover.productImageId,
              orderIndex: cover.orderIndex,
            };
          })
        );
      }

      if (this.specImageHasChangeIndex) {
        orderIndexs = orderIndexs.concat(
          this.detailViewModel.getImages(8).map((spec) => {
            return {
              productImageId: spec.productImageId,
              orderIndex: spec.orderIndex,
            };
          })
        );
      }
      this.orderIndexSubject.next(orderIndexs);
    } else {
      this.updateCoverLink();
    }
  }

  uploadImage(): void {
    if (this.pendingFiles.length > 0) {
      this.uploadProductSubject.next({
        productId: this.productId,
        refImageCatId: this.pendingFiles[0].refImageCatId,
        file: this.pendingFiles[0].file,
        oldFile: this.pendingFiles[0].oldFile,
        linkCoverImageUrl: this.pendingFiles[0].linkCoverImageUrl,
      });
    }
  }

  deleteImages(): void {
    let ids: number[] = [];
    ids = ids.concat(this.coverSelectIds);
    ids = ids.concat(this.overviewSelectIds);
    ids = ids.concat(this.specImageSelectIds);
    ids = ids.concat(this.thumbnailSelectIds);
    if (ids.length > 0) {
      const deleteSub = this.detailViewModel
        .deleteImages(ids)
        .subscribe((res) => {
          if (typeof res === 'number') {
            if (res > 0) {
              alert('delete successs');
              this.coverSelectIds = [];
              this.overviewSelectIds = [];
              this.specImageSelectIds = [];
              this.thumbnailSelectIds = [];
              this.detailViewModel.removeImages(ids);
            }
          }
        });

      this.subscription.add(deleteSub);
    }
  }

  onDropFile($event: FileList, index: number): void {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < $event.length; i++) {
      const mimeType = $event[i].type;
      if (mimeType.match(/image\/*/) == null) {
        alert('This file is not image : ' + $event[i].name);
        continue;
      }

      if ($event[i].size > 500000) {
        alert(`File size of ${$event[i].name} is over 500kb can not upload`);
        continue;
      } else if ($event[i].size <= 5000) {
        alert(`File size of ${$event[i].name} is less 5kb can not upload`);
        continue;
      }
      if (!this.pendingFiles.map((f) => f.file.name).includes($event[i].name)) {
        const reader = new FileReader();
        reader.readAsDataURL($event[i]);
        reader.onload = () => {
          const id =
            this.pendingFiles.length > 0
              ? this.pendingFiles[this.pendingFiles.length - 1].id + 1
              : 1;
          let oldFile = '';
          if (
            index === 5 &&
            this.detailViewModel.getImages(5)[0] !== undefined
          ) {
            oldFile = this.detailViewModel
              .getImages(5)[0]
              .url.replace(EndPoint.MainUri + 'files/', '');
            this.pendingFiles = this.pendingFiles.filter(
              (pend) => pend.refImageCatId !== 5
            );
          }
          this.pendingFiles.push({
            id,
            refImageCatId: index,
            file: $event[i],
            preFile: reader.result as string,
            progress: 0,
            oldFile,
            linkCoverImageUrl: '',
          });
        };
      } else {
        alert(`${$event[i].name}  is exist in list already`);
      }
    }
  }

  onGetPendingFiles(refId: number): IImageFile[] {
    return this.pendingFiles.filter((pf) => pf.refImageCatId === refId);
  }

  onGetErrorFiles(refId: number): IImageFile[] {
    return this.errorFiles.filter((ef) => ef.refImageCatId === refId);
  }

  onDropToChangeOrderIndex(orderIndex: number, refCatImageId: number): void {
    if (this.selectItem !== null) {
      this.detailViewModel.updateIndexOfImages(
        this.selectItem.productImageId,
        orderIndex,
        refCatImageId
      );
      switch (refCatImageId) {
        case 1:
          this.coverHasChangeIndex = true;
          break;
        case 2:
          this.thumbnailHasChangeIndex = true;
          break;
        case 4:
          this.overviewHasChangeIndex = true;
          break;
        case 8:
          this.specImageHasChangeIndex = true;
          break;
      }
    }
  }

  onDragEnd(): void {
    this.hoverOverviewIndex = -1;
    this.hoverCoverIndex = -1;
    this.hoverSpecImageIndex = -1;
    this.startIndex = -1;
    this.selectItem = null;
  }

  onDragStart(selectId: IImages, startIndex: number): void {
    this.selectItem = selectId;
    this.startIndex = startIndex;
  }

  checkDrag(id: number): boolean {
    return this.selectItem !== null
      ? this.selectItem.productImageId === id
      : false;
  }

  isSelectThumbnailSelectAll(): boolean {
    return this.thumbnailSelectIds.length > 0
      ? this.thumbnailSelectIds.length ===
          this.detailViewModel.getImages(2).length
      : false;
  }

  isSelectCoverSelectAll(): boolean {
    return this.coverSelectIds.length > 0
      ? this.coverSelectIds.length === this.detailViewModel.getImages(1).length
      : false;
  }

  isSelectOverviewSelectAll(): boolean {
    return this.overviewSelectIds.length > 0
      ? this.overviewSelectIds.length ===
          this.detailViewModel.getImages(4).length
      : false;
  }
  isSelectSpecImageSelectAll(): boolean {
    return this.specImageSelectIds.length > 0
      ? this.specImageSelectIds.length ===
          this.detailViewModel.getImages(8).length
      : false;
  }

  setCoverLink(url: string): void {
    if (this.pendingthumbnailSelectId > 0) {
      this.pendingFiles[
        this.pendingFiles.findIndex(
          (pend) => pend.id === this.pendingthumbnailSelectId
        )
      ].linkCoverImageUrl = url.replace(EndPoint.MainUri + 'files/', '');
      this.pendingthumbnailSelectId = 0;
    }
    if (this.productImageIdSelectId > 0) {
      this.detailViewModel.setCoverLink(
        this.productImageIdSelectId,
        url.replace(EndPoint.MainUri + 'files/', '')
      );

      this.thumbnailSelectIds.push(this.productImageIdSelectId);
      this.productImageIdSelectId = 0;
    }
  }

  setThumbnailSelectAll(): void {
    if (
      this.thumbnailSelectIds.length ===
      this.detailViewModel.getImages(2).length
    ) {
      this.thumbnailSelectIds = [];
    } else {
      this.thumbnailSelectIds = this.detailViewModel
        .getImages(2)
        .map((c) => c.productImageId);
    }
  }

  setCoverSelectAll(): void {
    if (
      this.coverSelectIds.length === this.detailViewModel.getImages(1).length
    ) {
      this.coverSelectIds = [];
    } else {
      this.coverSelectIds = this.detailViewModel
        .getImages(1)
        .map((c) => c.productImageId);
    }
  }

  setOverviewSelectAll(): void {
    if (
      this.overviewSelectIds.length === this.detailViewModel.getImages(4).length
    ) {
      this.overviewSelectIds = [];
    } else {
      this.overviewSelectIds = this.detailViewModel
        .getImages(4)
        .map((c) => c.productImageId);
    }
  }

  setSpecImageSelectAll(): void {
    if (
      this.specImageSelectIds.length ===
      this.detailViewModel.getImages(8).length
    ) {
      this.specImageSelectIds = [];
    } else {
      this.specImageSelectIds = this.detailViewModel
        .getImages(8)
        .map((c) => c.productImageId);
    }
  }

  thumbnailSelectIdsFunc(id: number): void {
    if (this.thumbnailSelectIds.find((ids) => ids === id) === undefined) {
      this.thumbnailSelectIds.push(id);
    } else {
      this.thumbnailSelectIds = this.thumbnailSelectIds.filter(
        (ids) => ids !== id
      );
    }
  }

  coverSelectIdsFunc(id: number): void {
    if (this.coverSelectIds.find((ids) => ids === id) === undefined) {
      this.coverSelectIds.push(id);
    } else {
      this.coverSelectIds = this.coverSelectIds.filter((ids) => ids !== id);
    }
  }

  overviewSelectIdsFunc(id: number): void {
    if (this.overviewSelectIds.find((ids) => ids === id) === undefined) {
      this.overviewSelectIds.push(id);
    } else {
      this.overviewSelectIds = this.overviewSelectIds.filter(
        (ids) => ids !== id
      );
    }
  }

  specImageSelectIdsFunc(id: number): void {
    if (this.specImageSelectIds.find((ids) => ids === id) === undefined) {
      this.specImageSelectIds.push(id);
    } else {
      this.specImageSelectIds = this.specImageSelectIds.filter(
        (ids) => ids !== id
      );
    }
  }

  checkSelectSpecImageId(id: number): boolean {
    return this.specImageSelectIds.find((ids) => ids === id) !== undefined;
  }

  checkthumbnailId(id: number): boolean {
    return this.thumbnailSelectIds.find((ids) => ids === id) !== undefined;
  }

  checkSelectCoverId(id: number): boolean {
    return this.coverSelectIds.find((ids) => ids === id) !== undefined;
  }

  checkSelectOverviewId(id: number): boolean {
    return this.overviewSelectIds.find((ids) => ids === id) !== undefined;
  }

  removeImagePendingList(id: number): void {
    this.pendingFiles = this.pendingFiles.filter((pf) => pf.id !== id);
  }

  removeImageErrorList(id: number): void {
    this.errorFiles = this.errorFiles.filter((ef) => ef.id !== id);
  }

  changeFileNameFunc(fileName: string): void {
    const errorFile = this.errorFiles.find(
      (ef) => ef.id === this.selectErrorItem.id
    );
    if (errorFile.file.name !== fileName) {
      this.errorFiles = this.errorFiles.filter((ef) => ef !== errorFile);
      const blob = errorFile.file.slice(0, errorFile.file.size);
      const newFile = new File([blob], fileName);
      this.selectErrorItem.file = newFile;
      this.selectErrorItem.progress = 0;
      this.pendingFiles.push(this.selectErrorItem);
      this.selectErrorItem = null;
    } else {
      alert('Should be change file name first!! Please try again...');
    }
  }
}
