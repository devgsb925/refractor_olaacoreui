import { EndPoint } from './../../../security/end-point';
import { IPendingBanner } from './interfaces/i-pending-banner';
import { IRefBanner } from './interfaces/i-ref-banner';
import { BannerApiService } from './banner-api.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { IBannerImage } from './interfaces/i-banner-image';
import { ICategory } from './interfaces/i-category';
import { IBannerDataContainer } from './interfaces/i-banner-data-container';

@Injectable()
export class BannerViewModelService {
  constructor(private api: BannerApiService) {}

  bannerSelectId = 0;
  categorySelectId = 0;

  pendingSelectTimeStamp = 0;
  linkSelected = '';

  homePageBannerIds: number[] = [];
  longBannerIds: number[] = [];
  dealBannerIds: number[] = [];
  brandIds: number[] = [];
  catSelectIds: number[] = [];

  selectIds: { id: number; refId: number }[] = [];

  private bannerReference: IRefBanner[] = [];
  private imageList: IBannerImage[] = [];
  private categories: ICategory[] = [];

  private pendingList: IPendingBanner[] = [];
  private errorList: IPendingBanner[] = [];

  //#region Normal Function
  readBannerReference(): Observable<IRefBanner[]> {
    return this.api.getBannerReference();
  }

  readBannerDataContainer(): Observable<IBannerDataContainer> {
    return this.api.getBannerDataContainer();
  }

  updateBannerDetailFunc(
    banners: IBannerImage[],
    categories: ICategory[]
  ): Observable<number> {
    return this.api.updateBannerDetail(banners, categories);
  }

  deleteCategoryImage(delId: number): Observable<number> {
    return this.api.deleteCategoryImage(delId);
  }

  deleteBanners(delIds: number[]): Observable<number> {
    return this.api.deleteBanners(delIds);
  }

  setBannerReference(ref: IRefBanner[]): void {
    this.bannerReference = ref;
  }

  setImageList(imgList: IBannerImage[]): void {
    this.imageList = imgList.map((img) => {
      if (img.fileUrl !== '') {
        img.fileUrl = EndPoint.MainUri + 'files/' + img.fileUrl;
      }

      return img;
    });
  }

  setCategories(cats: ICategory[]): void {
    this.categories = cats.map((cat) => {
      if (cat.bannerUrl !== '') {
        cat.bannerUrl = EndPoint.MainUri + 'files/' + cat.bannerUrl;
      }

      return cat;
    });
  }

  getReferences(): IRefBanner[] {
    return this.bannerReference;
  }

  getAllImageList(): IBannerImage[] {
    return this.imageList;
  }
  getImageById(id: number): IBannerImage{
    return this.imageList.find(img => img.id === id);
  }

  getImageList(refId: number): IBannerImage[] {
    return this.imageList.filter((img) => img.refBannerId === refId);
  }

  getCategories(): ICategory[] {
    return this.categories;
  }
  //#endregion Normal Function

  addNewToPending(pendings: IPendingBanner[]): void {
    this.pendingList = this.pendingList.concat(pendings);
  }

  getPendingList(refId: number): IPendingBanner[] {
    return this.pendingList.filter((pend) => pend.refBannerId == refId);
  }
  getAllPendingList(): IPendingBanner[] {
    return this.pendingList;
  }

  updateLinKBanner(link: string, refId: number): void {
    this.imageList[
      this.imageList.findIndex((b) => b.id === this.bannerSelectId)
    ].linkUrl = link;
    if (
      this.selectIds.find((id) => id.id === this.bannerSelectId) === undefined
    ) {
      this.selectIds.push({id:this.bannerSelectId, refId});
    }
  }
  updateLinkPending(link: string): void {
    this.pendingList[
      this.pendingList.findIndex(
        (p) => p.timeStamp === this.pendingSelectTimeStamp
      )
    ].link = link;
  }

  updateLinkCategoryPending(index: number, link: string): void {
    this.pendingList[index].link = link;
  }

  updateLinkCategory(link: string): void {
    this.categories[
      this.categories.findIndex((cat) => cat.id === this.categorySelectId)
    ].linkUrl = link;
  }

  removePendingList(timeStamp: number): void {
    this.pendingList = this.pendingList.filter(
      (p) => p.timeStamp !== timeStamp
    );
  }

  updateOrderIndexBanner(
    startId: number,
    startIndex: number,
    endIndex: number,
    refId: number
  ): void {
    let banners = this.imageList.filter((img) => img.refBannerId === refId);
    let orderIndex: number[] = [];
    let tempBanner: IBannerImage[] = [];
    if (startIndex > endIndex) {
      orderIndex = banners
        .map((b) => b.orderIndex)
        .filter((index) => index > endIndex);

      tempBanner = banners.filter(
        (b) => b.orderIndex >= endIndex && b.id !== startId
      );
    } else {
      orderIndex = banners
        .map((b) => b.orderIndex)
        .filter((index) => index >= startIndex && index !== endIndex);
      tempBanner = banners.filter((b) => b.orderIndex > startIndex);
    }

    orderIndex.forEach((v, i) => (tempBanner[i].orderIndex = v));

    banners = banners
      .filter((b) => !tempBanner.map((temp) => temp.id).includes(b.id))
      .concat(tempBanner);
    banners[banners.findIndex((b) => b.id == startId)].orderIndex = endIndex;
    this.imageList = this.imageList.filter((img) => img.refBannerId !== refId);
    this.imageList = this.imageList.concat(banners);
  }

  uploadBanner(
    refBannerId: number,
    refCatId: number,
    link: string,
    file: File
  ): Observable<any> {
    const formData = new FormData();

    formData.append('refAdsCatId', refBannerId.toString());
    formData.append('refCatId', refCatId.toString());
    formData.append('link', link);
    formData.append('files[]', file);
    return this.api.uploadBanners(formData);
  }

  uploadSuccess(id: number): void {
    if (this.pendingList[0].refBannerId > 0) {
      this.imageList.push({
        id,
        fileUrl: EndPoint.MainUri + 'files/' + this.pendingList[0].file.name,
        linkUrl: this.pendingList[0].link,
        orderIndex:
          this.getImageList(this.pendingList[0].refBannerId).length > 0
            ? Math.max(
                ...this.getImageList(this.pendingList[0].refBannerId).map(
                  (img) => img.orderIndex
                )
              ) + 1
            : 0,
        refBannerId: this.pendingList[0].refBannerId,
      });
    } else {
      const indextochange = this.categories.findIndex(
        (cat) => cat.id === this.pendingList[0].refCatId
      );
      this.categories[indextochange].bannerUrl =
        EndPoint.MainUri + 'files/' + this.pendingList[0].file.name;
      this.categories[indextochange].linkUrl = this.pendingList[0].link;
    }
  }

  uploadError(): void {
    this.errorList.push(this.pendingList[0]);
  }

  removeFirstPendingList(): void {
    this.pendingList.splice(0, 1);
  }

  deleteBannerFunc(): void {
    this.api
      .deleteBanners(
        this.selectIds.filter((id) => id !== null).map((s) => s.id)
      )
      .toPromise()
      .then((res) => {
        if (res > 0) {
          this.imageList = this.imageList.filter(
            (img) => !this.selectIds.map((s) => s.id).includes(img.id)
          );
          this.selectIds = [];
        } else {
          alert('not have any thing delete!?');
        }
      });
  }
}
