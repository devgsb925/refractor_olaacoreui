import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ThrowStmt } from '@angular/compiler';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { url } from 'inspector';
import { concat, Subject, Subscription } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { IRefBrands } from 'src/app/api/products/references/interfaces/i-ref-brands';
import { ProductsReferencesService } from 'src/app/api/products/references/products-references.service';
import { EndPoint } from 'src/app/security/end-point';
import { ProductReferencesViewModel } from 'src/app/view-model/product-references-view-model';
import { threadId } from 'worker_threads';
import { IUpdateBrandOrderIndex } from '../../interfaces/i-update-brand-order-index';
import { ValuesSettingApiService } from '../../values-setting-api.service';
import { MUpdateBrandName } from './interfaces/m-update-brand-name';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss'],
})
export class BrandsComponent implements OnInit, OnDestroy {
  constructor(
    private vmRef: ProductReferencesViewModel,
    private valueApi: ValuesSettingApiService
  ) {}

  file: File;
  logo: string = '';
  filePreview = '';
  brandId = 0;
  brandName = '';
  url = '';

  searchValue = '';

  inprocess = false;

  brandList: IRefBrands[] = [];

  @ViewChild('inputLogo') inputLogo: ElementRef;

  private subscription = new Subscription();
  private updateBrandOrderIndex = new Subject<IUpdateBrandOrderIndex[]>();

  ngOnInit(): void {
    this.vmRef.refBrandsList = this.vmRef.refBrandsList.sort(
      (a, b) => a.orderIndex - b.orderIndex
    );
    this.vmRef.refBrandsList.forEach((v) => this.brandList.push(v));

    const updateOrderIndexSub = this.updateBrandOrderIndex
      .pipe(
        concatMap((res) => {
          return this.valueApi.updateBrandOrdexIndex(res);
        })
      )
      .subscribe(() => console.log('udpate order index success!!!'));
    this.subscription.add(updateOrderIndexSub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  searchBrandFunc(): void {
    this.brandList = [];
    this.vmRef.refBrandsList
      .filter(
        (brand) =>
          brand.name.toLowerCase().includes(this.searchValue.toLowerCase()) ||
          brand.refBrandId.toString().slice(0, this.searchValue.length) ==
            this.searchValue
      )
      .forEach((brand) => {
        this.brandList.push(brand);
      });
  }

  onDropUpdateOrderIndex(event: CdkDragDrop<IRefBrands[]>): void {
    this.updateListOrderIndex(
      event.item.data.refBrandId,
      this.brandList[event.currentIndex].orderIndex
    );

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  updateListOrderIndex(id: number, newIndex: number): void {
    const oldBrandIndex = this.vmRef.refBrandsList.findIndex(
      (brand) => brand.refBrandId == id
    );
    const newBrandIndex = this.vmRef.refBrandsList.findIndex(
      (brand) => brand.orderIndex == newIndex
    );

    this.vmRef.refBrandsList.splice(
      newBrandIndex,
      0,
      this.vmRef.refBrandsList.splice(oldBrandIndex, 1)[0]
    );

    this.vmRef.refBrandsList.forEach((v, i) => {
      v.orderIndex = i;
    });

    let updateOrderIndexList: IUpdateBrandOrderIndex[] = [];
    if (newBrandIndex > oldBrandIndex) {
      updateOrderIndexList = this.vmRef.refBrandsList
        .filter((_, i) => i <= newBrandIndex && i >= oldBrandIndex)
        .map((res) => {
          return {
            id: res.refBrandId,
            orderIndex: res.orderIndex,
          };
        });
    } else {
      updateOrderIndexList = this.vmRef.refBrandsList
        .filter((_, i) => i >= newBrandIndex && i <= oldBrandIndex)
        .map((res) => {
          return {
            id: res.refBrandId,
            orderIndex: res.orderIndex,
          };
        });
    }
    this.updateBrandOrderIndex.next(updateOrderIndexList);
  }

  selectBrand(brand: IRefBrands): void {
    this.brandId = brand.refBrandId;
    this.brandName = brand.name;
    this.url = brand.url;
    this.file = undefined;
    this.filePreview = '';
    this.inputLogo.nativeElement.value = '';
  }

  onChooseFile(fileList: FileList): void {

    if (!this.inprocess) {
      this.inprocess = true;
      const file: File = fileList.item(0);
      if (file.type.match(/image\/*/) == null) {
        alert('This file is not image : ' + file.name);
        return;
      }
      if (file.size > 500000) {
        alert(`File size of ${file.name} is over 500kb can not upload`);
        return;
      }
      if (file.size < 5000) {
        alert(`File size of ${file.name} is less 5kb can not upload`);
        return;
      }
      this.file = file;
      const reader = new FileReader();
      reader.readAsDataURL(fileList.item(0));
      reader.onload = () => {
        this.filePreview = reader.result as string;
        this.inprocess = false;
      };
    }
  }

  addBrandFunc(): void {
    if (!this.inprocess) {
      if (this.checkExistBrandName()) {
        alert('This brand is exist already!!');
        return;
      }
      if (this.checkExitLogo()) {
        alert('This logo exist already!!');
        return;
      }


      this.inprocess = true;
      const addBrandSub = this.vmRef
        .addBrandToApi(this.brandName, this.file)
        .subscribe({
          next: (res) => {
            if (res > 0) {
              this.vmRef.refBrandsList.push({
                refBrandId: res,
                name: this.brandName,
                orderIndex: this.vmRef.refBrandsList.length,
                url:
                  this.file != undefined
                    ? EndPoint.MainUri + 'files/' + this.file.name
                    : '',
              });
              this.searchBrandFunc();
              this.cancelBrandFunc();
            }
            this.inprocess = false;
          },
          error: (err) => {
            alert(err.error);
            console.log(err);
          },
        });
      this.subscription.add(addBrandSub);
    }
  }

  reuploadLogo(): void {
    if (!this.inprocess) {
      if (this.checkExitLogo()) {
        alert('This logo is exist already!!');
        return;
      }


      this.inprocess = true;
      const oldUrl = this.url.replace(EndPoint.MainUri + 'files/', '');
      const formData = new FormData();
      formData.append('id', this.brandId.toString());
      formData.append('url', oldUrl);
      formData.append('files[]', this.file);
      const updateBrandSub = this.valueApi
        .reuploadBrandImage(formData)
        .subscribe({
          next: () => {

          },
          error: err => {
            alert(err.error);
            console.log(err);
          },
          complete: () => {
            const updateIndex = this.vmRef.refBrandsList.findIndex(
              (brand) => brand.refBrandId == this.brandId
            );
            const newUrl = EndPoint.MainUri + 'files/' + this.file.name;
            this.vmRef.refBrandsList[updateIndex].url = newUrl;
            this.url = newUrl;


            this.searchBrandFunc();
            this.file = undefined
            this.filePreview = '';
            this.inprocess = false;
          }
        });
      this.subscription.add(updateBrandSub);
    }
  }

  updateBrandFunc(): void{
    if (!this.inprocess) {
      if (this.checkExistBrandName()) {
        alert('This brand is exist already!!');
        return;
      }


      this.inprocess = true;
      const model: MUpdateBrandName = { id: this.brandId, name: this.brandName };
      const updateBrandSub = this.valueApi.updateBrandName(model).subscribe({
        next: res => {
          if (res > 0) {
            const updateIndex = this.vmRef.refBrandsList.findIndex(brand => brand.refBrandId == this.brandId);
            this.vmRef.refBrandsList[updateIndex].name = this.brandName;
            this.searchBrandFunc();
            this.cancelBrandFunc();
          }
          this.inprocess = false;
        },
        error: err => {
          alert(err.error);
          console.log(err);
        }
      });
      this.subscription.add(updateBrandSub);
    }
  }

  cancelBrandFunc(): void {
    this.brandId = 0;
    this.brandName = '';
    this.file = undefined;
    this.filePreview = '';
    this.url = '';
    this.inputLogo.nativeElement.value = '';
  }

  deleteLogoFunc(): void{
    if (!this.inprocess) {
      this.inprocess = true;
      if (window.confirm('Are you sure to delete this logo!?')) {
        const deleteUrl = this.url.replace(EndPoint.MainUri + 'files/', '');
        this.valueApi.deleteBrandImage(this.brandId, deleteUrl).subscribe({
          next: res => {
            if (res > 0) {
              const updateIndex = this.vmRef.refBrandsList.findIndex(brand => brand.refBrandId == this.brandId);
              this.vmRef.refBrandsList[updateIndex].url = '';
              this.filePreview = '';
              this.url = '';
            }
            this.inprocess = false;
          },
          error: err => {
            alert(err.error);
            console.log(err);
          }
        })
      }
    }
  }

  checkExistBrandName(): boolean{
    return this.vmRef.refBrandsList.find(brand => brand.name.toLowerCase() == this.brandName.toLowerCase()) != undefined;
  }
  checkExitLogo(): boolean{
    return this.vmRef.refBrandsList.find(brand => brand.url.replace(EndPoint.MainUri + 'files/', '') == this.file.name) != undefined;
  }
}
