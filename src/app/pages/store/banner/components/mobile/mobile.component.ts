import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { of, Subject, Subscription } from 'rxjs';
import { catchError, concatMap, debounceTime, map } from 'rxjs/operators';
import { BannerViewModelService } from '../../banner-view-model.service';
import { IBannerImage } from '../../interfaces/i-banner-image';
import { IPendingBanner } from '../../interfaces/i-pending-banner';

@Component({
  selector: 'app-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.scss'],
})
export class MobileComponent implements OnInit {
  constructor(public viewModel: BannerViewModelService) {}

  showSetLinkModal = false;
  showSetLinkCategoryModal = false;
  selectItem: IBannerImage = null;

  homePageHoverIndex = 0;
  longBannerHoverIndex = 0;
  dealBannerHoverIndex = 0;
  brandHoverIndex = 0;

  startIndex = 0;

  refBannerHasChange: number[] = [];

  private uploadBannerSubject = new Subject<IPendingBanner>();

  private subsription: Subscription[] = [];

  ngOnInit(): void {
    if (this.viewModel.getAllImageList().length > 0) {
      if (this.viewModel.getImageList(7).length > 0) {
        this.viewModel.bannerSelectId = this.viewModel
          .getImageList(7)
          .sort((a, b) => a.orderIndex - b.orderIndex)[0].id;
      } else if (this.viewModel.getImageList(8).length > 0) {
        this.viewModel.bannerSelectId = this.viewModel
          .getImageList(8)
          .sort((a, b) => a.orderIndex - b.orderIndex)[0].id;
      } else if (this.viewModel.getImageList(9).length > 0) {
        this.viewModel.bannerSelectId = this.viewModel
          .getImageList(9)
          .sort((a, b) => a.orderIndex - b.orderIndex)[0].id;
      }
    }

    const uploadSub = this.uploadBannerSubject
      .pipe(
        concatMap((res) => {
          return this.viewModel.uploadBanner(
            res.refBannerId,
            res.refCatId,
            res.link,
            res.file
          );
        }),
        catchError((res) => of(res)),
        map((event) => {
          if (event instanceof HttpResponse) {
            return event.body;
          } else if (event instanceof HttpErrorResponse) {
            return event;
          } else {
            if (
              event.type > 0 &&
              event.total !== undefined &&
              this.viewModel.getAllPendingList()[0] !== undefined
            ) {
              this.viewModel.getAllPendingList()[0].progress = Math.round(
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
        if (typeof res !== 'string') {
          if (res !== undefined && !(res instanceof HttpErrorResponse)) {
            if (res > 0) {
              this.viewModel.uploadSuccess(res);
            } else {
              this.viewModel.uploadError();
            }
          } else if (res instanceof HttpErrorResponse) {
            this.viewModel.uploadError();
          }
          this.viewModel.removeFirstPendingList();
          if (this.viewModel.getAllPendingList()[0] !== undefined) {
            this.uploadBannerSubject.next(
              this.viewModel.getAllPendingList()[0]
            );
          } else {
            this.clearFunc();
          }
        }
      });

    this.subsription.push(uploadSub);
  }

  //#region Common Functions

  uploadFunc(): void {
    if (this.refBannerHasChange.length > 0) {
      let banners = [];
      this.refBannerHasChange.forEach(
        (refId) =>
          (banners = banners.concat(this.viewModel.getImageList(refId)))
      );
      this.viewModel
        .updateBannerDetailFunc(banners, [])
        .toPromise()
        .then((res) => {
          if (res > 0) {
            alert('Update data complete!!');
          } else {
            alert('Has some problem in update proccess!?');
          }

          if (this.viewModel.getAllPendingList().length > 0) {
            this.uploadBannerSubject.next(
              this.viewModel.getAllPendingList()[0]
            );
          }
        });
    } else if (
      this.viewModel.selectIds.length > 0 ||
      this.viewModel.catSelectIds.length > 0
    ) {
      const banners = this.viewModel
        .getAllImageList()
        .filter((img) =>
          this.viewModel.selectIds.map((s) => s.id).includes(img.id)
        );
      const categories = this.viewModel
        .getCategories()
        .filter((cat) => this.viewModel.catSelectIds.includes(cat.id));

      this.viewModel
        .updateBannerDetailFunc(banners, categories)
        .toPromise()
        .then((res) => {
          if (res > 0) {
            alert('Update data complete!!');
            this.clearFunc();
          } else {
            alert('Has some problem in update proccess!?');
          }

          if (this.viewModel.getAllPendingList().length > 0) {
            this.uploadBannerSubject.next(
              this.viewModel.getAllPendingList()[0]
            );
          }
        });
    } else if (this.viewModel.getAllPendingList().length > 0) {
      this.uploadBannerSubject.next(this.viewModel.getAllPendingList()[0]);
    }
  }

  deleteFunc(): void {
    if (window.confirm('Are you sure to delete your selected banner?')) {
      this.viewModel.deleteBannerFunc();
    }
  }

  clearFunc(): void {
    this.viewModel.selectIds = [];
    this.refBannerHasChange = [];
  }
  //#endregion

  //#region Select Functions
  selectAllFunc(refId: number): void {
    const bannerImages = this.viewModel.getImageList(refId);

    if (
      this.viewModel.selectIds.filter((s) => s.refId === refId).length !==
      bannerImages.length
    ) {
      this.viewModel.selectIds = this.viewModel.selectIds.filter(
        (ids) => ids.refId !== refId
      );
      this.viewModel.selectIds = this.viewModel.selectIds.concat(
        bannerImages.map((d) => {
          return { id: d.id, refId };
        })
      );
    } else {
      this.viewModel.selectIds = this.viewModel.selectIds.filter(
        (ids) => ids.refId !== refId
      );
    }
  }
  checkSelectAllFunc(refId: number): boolean {
    return (
      this.viewModel.selectIds.filter((ids) =>
        this.viewModel
          .getImageList(refId)
          .map((img) => img.id)
          .includes(ids.id)
      ).length === this.viewModel.getImageList(refId).length &&
      this.viewModel.selectIds.filter((ids) =>
        this.viewModel
          .getImageList(refId)
          .map((img) => img.id)
          .includes(ids.id)
      ).length > 0
    );
  }

  selectIdFunc(id: number, refId: number): void {
    const existId = this.viewModel.selectIds.find((sid) => sid.id === id);
    if (existId !== undefined) {
      this.viewModel.selectIds = this.viewModel.selectIds.filter(
        (sid) => sid.id !== id
      );
    } else {
      this.viewModel.selectIds.push({ id, refId });
    }
  }
  checkSelectFunc(id: number): boolean {
    return this.viewModel.selectIds.find((sid) => sid.id === id) !== undefined;
  }
  autoSelect(id: number, refId: number): void {
    const existId = this.viewModel.selectIds.find((sid) => sid.id === id);
    if (existId === undefined) {
      this.viewModel.selectIds.push({ id, refId });
    }
  }
  //#endregion

  //#region File Functions
  onDropFiles(fileList: FileList, refBannerId: number, refCatId: number): void {
    for (let i = 0; i < fileList.length; i++) {
      const file: File = fileList.item(i);
      if (file.type.match(/image\/*/) == null) {
        alert('This file is not image : ' + file.name);
        continue;
      }
      if (file.size > 500000) {
        alert(`File size of ${file.name} is over 500kb can not upload`);
        continue;
      }
      if (
        !this.viewModel
          .getPendingList(refBannerId)
          .map((f) => f.file.name)
          .includes(file.name)
      ) {
        const reader = new FileReader();

        reader.readAsDataURL(fileList.item(i));
        reader.onload = () => {
          if (refCatId > 0) {
            const existCategoriesPending = this.viewModel
              .getAllPendingList()
              .find((pend) => pend.refCatId == refCatId);
            if (existCategoriesPending !== undefined) {
              this.viewModel.removePendingList(
                existCategoriesPending.timeStamp
              );
            }
          }
          this.viewModel.addNewToPending([
            {
              timeStamp: Date.now(),
              refBannerId,
              refCatId,
              file: fileList.item(i),
              imgSource: reader.result as string,
              progress: 0,
              link: '',
            },
          ]);
        };
      } else {
        alert(`File ${file.name} is exist already!!`);
      }
    }
  }

  onDropToChangeOrderIndex(dropOrderIndex: number, refId: number): void {
    if (this.selectItem !== null) {
      this.viewModel.updateOrderIndexBanner(
        this.selectItem.id,
        this.selectItem.orderIndex,
        dropOrderIndex,
        refId
      );
      if (this.refBannerHasChange.find((id) => id === refId) === undefined) {
        this.refBannerHasChange.push(refId);
      }
    }
  }

  onDragStart(item: IBannerImage, startIndex: number): void {
    this.selectItem = item;
    this.startIndex = startIndex;
  }

  checkDrag(id: number): boolean {
    return this.selectItem !== null ? this.selectItem.id === id : false;
  }

  onDragEnd(): void {
    this.homePageHoverIndex = -1;
    this.longBannerHoverIndex = -1;
    this.dealBannerHoverIndex = -1;
    this.brandHoverIndex = -1;

    this.startIndex = -1;
    this.selectItem = null;
  }
  //#endregion

  showSetLinkModalFunc(
    id: number,
    index: number,
    state: boolean,
    link: string
  ): void {
    if (index === 0) {
      this.viewModel.bannerSelectId = id;
    } else if (index === -1) {
      this.viewModel.bannerSelectId = 0;
      this.viewModel.pendingSelectTimeStamp = 0;
    } else {
      this.viewModel.pendingSelectTimeStamp = id;
    }
    this.viewModel.linkSelected = link;
    this.showSetLinkModal = state;
    this.showSetLinkCategoryModal = false;
  }

  saveLinkFunc(link: string): void {
    if (this.showSetLinkModal) {
      if (this.viewModel.bannerSelectId !== 0) {
        const refId = this.viewModel.getImageById(this.viewModel.bannerSelectId)
          .refBannerId;
        this.viewModel.updateLinKBanner(link, refId);
      } else if (this.viewModel.pendingSelectTimeStamp !== 0) {
        this.viewModel.updateLinkPending(link);
      }

      this.viewModel.bannerSelectId = 0;
      this.viewModel.pendingSelectTimeStamp = 0;
      this.showSetLinkModal = false;
    } else if (this.showSetLinkCategoryModal) {
      const indextochange = this.viewModel
        .getAllPendingList()
        .findIndex((cat) => cat.refCatId == this.viewModel.categorySelectId);

      if (indextochange > -1) {
        this.viewModel.updateLinkCategoryPending(indextochange, link);
      } else {
        this.viewModel.updateLinkCategory(link);
        const existCatId = this.viewModel.catSelectIds.find(
          (id) => id === this.viewModel.categorySelectId
        );
        if (existCatId === undefined) {
          this.viewModel.catSelectIds.push(this.viewModel.categorySelectId);
        }
      }

      this.viewModel.pendingSelectTimeStamp = 0;
      this.showSetLinkCategoryModal = false;
    }
  }

  showSetLinkCategoryFunc(link): void {
    this.viewModel.linkSelected = link;
    this.showSetLinkCategoryModal = true;
    this.showSetLinkModal = false;
  }

  getSelectBanner(): IBannerImage {
    return this.viewModel
      .getAllImageList()
      .find((img) => img.id === this.viewModel.bannerSelectId);
  }
}
