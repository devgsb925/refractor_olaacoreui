import { switchMap } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ImagesViewModelService } from './images-view-model.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { importType } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss'],
})
export class ImagesComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private routerSnapshot: ActivatedRoute,
    public imagesViewModel: ImagesViewModelService
  ) {}

  productId = 0;
  productIdSubject = new Subject<number>();
  refImgCatid = 0;
  showAddModal = false;
  showPreview = false;

  coverIndex = 0;
  overViewIndex = 0;

  files: File[] = [];
  imgUrl: any[] = [];

  private subscription: Subscription[] = [];

  ngOnInit(): void {
    this.productId = parseInt(
      this.routerSnapshot.snapshot.paramMap.get('id'),
      10
    );
    const productIdSub = this.productIdSubject
      .pipe(
        switchMap((res) => {
          return this.imagesViewModel.readImages(res);
        })
      )
      .subscribe((res) => {
        if (
          !(res instanceof HttpErrorResponse) &&
          res !== null &&
          res !== undefined
        ) {
          if (res.length > 0) {
            this.imagesViewModel.setImages(res);
          } else {
            alert('don\'t have image');
          }
        } else {
          if (res !== null) {
            const errorRes = res as HttpErrorResponse;
            alert(errorRes.error.text);
          } else {
            // alert('Null');
          }
        }
      });

    this.subscription.push(productIdSub);

    this.productIdSubject.next(this.productId);
  }

  ngOnDestroy(): void {
    this.subscription.forEach((s) => s.unsubscribe());
  }

  onFilesChange($event: FileList): void {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < $event.length; i++) {
      const mimeType = $event[i].type;
      if (mimeType.match(/image\/*/) == null) {
        alert('This file is not image : ' + $event[i].name);
        continue;
      }
      this.files.push($event[i]);
      this.preview($event[i]);
    }
  }

  preview(file: File): any {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      this.imgUrl.push(reader.result);
    };
  }

  showAddModalFunc(refImgCatId: number): void {
    this.refImgCatid = refImgCatId;
    this.showAddModal = true;
  }

  uploadFunc(): void {
    if (this.files.length > 0 && this.refImgCatid > 0) {
      const uploadSub = this.imagesViewModel
        .uploadImages(this.productId, this.refImgCatid, this.files)
        .subscribe((res) => {
          if (
            !(res instanceof HttpErrorResponse) &&
            res !== null &&
            res !== undefined
          ) {
            if (res > 0) {
              alert('Upload Successfully!');
              this.clearFunc();
              this.refImgCatid = 0;
              this.productIdSubject.next(this.productId);
              this.showAddModal = false;
            } else {
              alert('Don\'t Have upload');
            }
          } else {
            if (res !== null && res !== undefined) {
              const errorRes = res as HttpErrorResponse;
              alert(errorRes.error.text);
            } else {
              alert('Has error something Or Maybe this image is exist already?');
            }
          }
        });

      this.subscription.push(uploadSub);
    }
  }

  getName(i: number): string {
    return this.files[i] !== undefined ? this.files[i].name : '';
  }

  closeFunc(): void {
    this.router.navigate(['store/products']);
  }

  clearFunc(): void {
    this.files = [];
    this.imgUrl = [];
  }

  deleteFunc(id: number): void {
    const deleteSub = this.imagesViewModel.deleteImages(id).subscribe((res) => {
      if (
        !(res instanceof HttpErrorResponse) &&
        res !== null &&
        res !== undefined
      ) {
        if (res > 0) {
          this.imagesViewModel.removeImage(id);
          alert('Delete Successfully');
        } else {
          alert('Not have delete!! please try again..');
        }
      } else {
        if (res !== null) {
          const errorRes = res as HttpErrorResponse;
          alert(errorRes.error.text);
        } else {
          alert('Has some error');
        }
      }
    });
    this.subscription.push(deleteSub);
  }

  showPreviewFunc(orderIndex: number, index: number): void {
    if (index === 0) {
      this.coverIndex = orderIndex;
      this.overViewIndex = 0;
    } else {
      this.overViewIndex = orderIndex;
      this.coverIndex = 0;
    }
    this.showPreview = true;
  }

  updateIndexOfImages(id: number, event: any, index: number): void {
    const value: number = parseInt(event.target.value, 10);
    let imgs =
      index === 0
        ? this.imagesViewModel.getCovers()
        : this.imagesViewModel.getOverviews();

    if (imgs.find((c) => c.orderIndex === value)) {
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

        this.imagesViewModel.updateInstanceImages(imgs);
        imgs[imgs.findIndex((c) => c.productImageId === id)].orderIndex = value;
      } else {


        const orderIndexs = imgs
          .map((img) => img.orderIndex)
          .filter((oi) => oi >= current.orderIndex && oi !== value);
        const tempImgs = imgs.filter(
          (img) =>
            img.orderIndex > current.orderIndex
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
        this.imagesViewModel.updateInstanceImages(imgs);
      }
    } else {
      imgs[imgs.findIndex((c) => c.productImageId === id)].orderIndex = value;
    }
  }

  saveUpdateOrderIndex(): void{
    const updateOrderIndexSub = this.imagesViewModel.updateImagesOrderIndex().subscribe(res => {
      if (
        !(res instanceof HttpErrorResponse) &&
        res !== null &&
        res !== undefined
      ) {
        if (res > 0) {
          alert('Update Successfully');
        } else {
          alert('Not have update!! please try again..');
        }
      } else {
        if (res !== null) {
          const errorRes = res as HttpErrorResponse;
          alert(errorRes.error.text);
        } else {
          alert('Has some error');
        }
      }
    });
    this.subscription.push(updateOrderIndexSub);
  }

  getPreviewCovers(): string {
    const cover = this.imagesViewModel
      .getCovers()
      .find((c) => c.orderIndex === this.coverIndex);

    return cover !== undefined ? cover.url : '';
  }

  getPreviewOverView(): string {
    const overview = this.imagesViewModel
      .getOverviews()
      .find((c) => c.orderIndex === this.overViewIndex);

    return overview !== undefined ? overview.url : '';
  }

  nextPreviewFunc(): void {
    if (this.coverIndex > 0) {
      const newIndex = this.imagesViewModel
        .getCovers()
        .findIndex((c) => c.orderIndex === this.coverIndex);
      if (newIndex + 1 < this.imagesViewModel.getCovers().length) {
        this.coverIndex = this.imagesViewModel.getCovers()[
          newIndex + 1
        ].orderIndex;
      } else {
        this.coverIndex = this.imagesViewModel.getCovers()[0].orderIndex;
      }
    } else {
      const newIndex = this.imagesViewModel
        .getOverviews()
        .findIndex((c) => c.orderIndex === this.overViewIndex);
      if (newIndex + 1 < this.imagesViewModel.getOverviews().length) {
        this.overViewIndex = this.imagesViewModel.getOverviews()[
          newIndex + 1
        ].orderIndex;
      } else {
        this.overViewIndex = this.imagesViewModel.getOverviews()[0].orderIndex;
      }
    }
  }

  prevPreviewFunc(): void {
    if (this.coverIndex > 0) {
      const newIndex = this.imagesViewModel
        .getCovers()
        .findIndex((c) => c.orderIndex === this.coverIndex);
      if (newIndex - 1 > 0) {
        this.coverIndex = this.imagesViewModel.getCovers()[
          newIndex - 1
        ].orderIndex;
      } else {
        this.coverIndex = this.imagesViewModel.getCovers()[
          this.imagesViewModel.getCovers().length - 1
        ].orderIndex;
      }
    } else {
      const newIndex = this.imagesViewModel
        .getOverviews()
        .findIndex((c) => c.orderIndex === this.overViewIndex);
      if (newIndex - 1 > 0) {
        this.overViewIndex = this.imagesViewModel.getOverviews()[
          newIndex - 1
        ].orderIndex;
      } else {
        this.overViewIndex = this.imagesViewModel.getCovers()[
          this.imagesViewModel.getCovers().length - 1
        ].orderIndex;
      }
    }
  }
}
