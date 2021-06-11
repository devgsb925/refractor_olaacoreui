import { CategoriesApiService } from './categories-api.service';
import { concatMap } from 'rxjs/operators';
import { CategoriesViewModelService } from './categories-view-model.service';
import { IRefCategory } from './../../../api/products/references/interfaces/i-ref-category';
import { ProductReferencesViewModel } from './../../../view-model/product-references-view-model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Subscription, Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { EndPoint } from 'src/app/security/end-point';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit, OnDestroy {
  //#region Variable
  cat1Id = 1;
  cat2Id = 0;
  cat3Id = 0;

  selectId = 0;
  parentId = 0;
  name = '';

  mainIds: number[] = [];
  sub1Ids: number[] = [];
  sub2Ids: number[] = [];

  mainCategories: IRefCategory[] = [];
  sub1Categories: IRefCategory[] = [];
  sub2Categories: IRefCategory[] = [];

  showAddModal = false;
  showEditModal = false;

  pendingFile: File;

  previewFile = '';

  inprocess = false;

  private updateOrderIndexSubject = new Subject<
    { RefCategoryId: number; OrderIndex: number }[]
  >();

  //#endregion

  //#region Observable
  private subscription = new Subscription();
  //#endregion

  constructor(
    public refViewModel: ProductReferencesViewModel,
    public categoriesViewModel: CategoriesViewModelService,
    private apiCategories: CategoriesApiService
  ) {}

  ngOnInit(): void {

    this.apiCategories.categories().subscribe(
      (res) => {
        this.refViewModel.setRefCategories(res);
      },
      (err) => {
        console.log(err);
      }, ()=> {

        this.mainCategories = this.refViewModel.getCategoriesById(1);
        this.cat1Id = this.refViewModel.getCategoriesById(1)[0].refCategoryId;
        this.sub1Categories = this.refViewModel.getCategoriesById(this.cat1Id);
        this.cat2Id =
          this.sub1Categories[0] !== undefined
            ? this.sub1Categories[0].refCategoryId
            : -1;
        this.sub2Categories = this.refViewModel.getCategoriesById(this.cat2Id);
        if (this.sub2Categories.length > 0) {
          this.cat3Id = this.sub2Categories[0].refCategoryId;
        }

        const updateOrderIndexSub = this.updateOrderIndexSubject
          .pipe(
            concatMap((data) => {
              return this.categoriesViewModel.updateOrderIndexCategory(data);
            })
          )
          .subscribe((res) => {
            if (typeof res === 'number' && res > 0) {
              console.log('Update OrderIndex Complete');
            } else {
              if (res !== null && typeof res !== 'number') {
                const errorRes = res as HttpErrorResponse;
                alert(errorRes.error.text);
              } else {
                alert('Have some problem! Please try again');
              }
            }
          });
        this.subscription.add(updateOrderIndexSub);
      });

  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  drop(event: CdkDragDrop<IRefCategory[]>, index: number): void {
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
    let i = 0;
    let orderIndexs: number[] = [];

    switch (index) {
      case 0:
        orderIndexs = this.refViewModel
          .getCategoriesById(1)
          .map((cat) => cat.orderIndex);
        orderIndexs.forEach((orderIndex) => {
          this.mainCategories[i].orderIndex = orderIndex;
          i++;
        });
        this.updateOrderIndexFunc(this.mainCategories);
        break;
      case 1:
        orderIndexs = this.refViewModel
          .getCategoriesById(this.cat1Id)
          .map((cat) => cat.orderIndex);
        orderIndexs.forEach((orderIndex) => {
          this.sub1Categories[i].orderIndex = orderIndex;
          i++;
        });
        this.updateOrderIndexFunc(this.sub1Categories);
        break;
      case 2:
        orderIndexs = this.refViewModel
          .getCategoriesById(this.cat2Id)
          .map((cat) => cat.orderIndex);
        orderIndexs.forEach((orderIndex) => {
          this.sub2Categories[i].orderIndex = orderIndex;
          i++;
        });

        this.updateOrderIndexFunc(this.sub2Categories);
        break;
    }
  }

  onSelectItem(id: number, index: number): void {
    switch (index) {
      case 0:
        this.cat1Id = id;
        this.sub1Categories = this.refViewModel.getCategoriesById(id);
        if (this.sub1Categories.length > 0) {
          this.cat2Id = this.sub1Categories[0].refCategoryId;
          this.sub2Categories = this.refViewModel.getCategoriesById(
            this.cat2Id
          );
          if (this.sub2Categories.length > 0) {
            this.cat3Id = this.sub2Categories[0].refCategoryId;
          }
        } else {
          this.sub2Categories = [];
          this.cat3Id = 0;
        }
        this.sub1Ids = [];
        this.sub2Ids = [];
        break;
      case 1:
        this.cat2Id = id;
        this.sub2Categories = this.refViewModel.getCategoriesById(id);
        if (this.sub2Categories.length > 0) {
          this.cat3Id = this.sub2Categories[0].refCategoryId;
        }
        this.sub2Ids = [];
        break;
      case 2:
        this.cat3Id = id;
        break;
    }
  }

  onSelectId(id: number, index: number): void {
    switch (index) {
      case 0:
        const mainId = this.mainIds.find((mid) => mid === id);
        if (mainId === undefined) {
          this.mainIds.push(id);
        } else {
          this.mainIds = this.mainIds.filter((mid) => mid !== id);
        }
        break;
      case 1:
        const sub1Id = this.sub1Ids.find((s1id) => s1id === id);
        if (sub1Id === undefined) {
          this.sub1Ids.push(id);
        } else {
          this.sub1Ids = this.sub1Ids.filter((mid) => mid !== id);
        }
        break;
      case 2:
        const sub2Id = this.sub2Ids.find((s2id) => s2id === id);
        if (sub2Id === undefined) {
          this.sub2Ids.push(id);
        } else {
          this.sub2Ids = this.sub2Ids.filter((s2id) => s2id !== id);
        }
        break;
    }
  }

  checkSelectId(id: number, index: number): boolean {
    switch (index) {
      case 0:
        const mainId = this.mainIds.find((mid) => mid === id);
        return mainId !== undefined;
      case 1:
        const sub1Id = this.sub1Ids.find((s1id) => s1id === id);
        return sub1Id !== undefined;
      case 2:
        const sub2Id = this.sub2Ids.find((s2id) => s2id === id);
        return sub2Id !== undefined;
    }
  }

  selectAll(index: number): void {
    switch (index) {
      case 0:
        if (this.checkSelectAll(index)) {
          this.mainIds = [];
        } else {
          this.mainIds = this.mainCategories.map((cat) => cat.refCategoryId);
        }
        break;
      case 1:
        if (this.checkSelectAll(index)) {
          this.sub1Ids = [];
        } else {
          this.sub1Ids = this.sub1Categories.map((cat) => cat.refCategoryId);
        }
        break;
      case 2:
        if (this.checkSelectAll(index)) {
          this.sub2Ids = [];
        } else {
          this.sub2Ids = this.sub2Categories.map((cat) => cat.refCategoryId);
        }
        break;
    }
  }

  checkSelectAll(index: number): boolean {
    switch (index) {
      case 0:
        return (
          this.mainIds.length === this.mainCategories.length &&
          this.mainCategories.length > 0
        );
      case 1:
        return (
          this.sub1Ids.length === this.sub1Categories.length &&
          this.sub1Categories.length > 0
        );
      case 2:
        return (
          this.sub2Ids.length === this.sub2Categories.length &&
          this.sub2Categories.length > 0
        );
    }
  }

  addFunc(): void {
    if (
      this.name !== '' &&
      this.parentId !== 0 &&
      !this.refViewModel.checkCategoryExist(this.name)
    ) {
      const addCatSub = this.categoriesViewModel
        .addCategory(this.parentId, this.name, this.pendingFile)
        .subscribe({
          next: (res) => {
            if (typeof res === 'number' && res > 0) {
              if (this.parentId === 1) {
                const orderIndex = Math.max.apply(
                  Math,
                  this.mainCategories.map((cat) => cat.orderIndex)
                );
                const newCategory: IRefCategory = {
                  refCategoryId: res,
                  name: this.name,
                  icon: EndPoint.MainUri + 'files/' + this.pendingFile.name,
                  parentId: 1,
                  orderIndex: orderIndex + 1,
                  bannerUrl: '',
                  link: ''
                };
                this.refViewModel.addCategories(newCategory);
                this.mainCategories.push(newCategory);
              } else if (
                this.sub1Categories.find(
                  (sub) => sub.refCategoryId === this.parentId
                ) === undefined
              ) {
                const orderIndex = Math.max.apply(
                  Math,
                  this.sub1Categories.map((cat) => cat.orderIndex)
                );
                const newCategory: IRefCategory = {
                  refCategoryId: res,
                  name: this.name,
                  icon: EndPoint.MainUri + 'files/' + this.pendingFile.name,
                  parentId: this.parentId,
                  orderIndex: orderIndex + 1,
                  bannerUrl: '',
                  link: ''
                };
                this.refViewModel.addCategories(newCategory);
                this.sub1Categories.push(newCategory);
              } else {
                const orderIndex = Math.max.apply(
                  Math,
                  this.sub2Categories.map((cat) => cat.orderIndex)
                );
                const newCategory: IRefCategory = {
                  refCategoryId: res,
                  name: this.name,
                  icon: EndPoint.MainUri + 'files/' + this.pendingFile.name,
                  parentId: this.parentId,
                  orderIndex: orderIndex + 1,
                  bannerUrl: '',
                  link: ''
                };
                this.refViewModel.addCategories(newCategory);
                this.sub2Categories.push(newCategory);
              }

              this.pendingFile = null;
              this.previewFile = '';
              this.showAddModalFunc(0);
            }
          },
          error: (err) => {
            const errorRes = err as HttpErrorResponse;
            alert(errorRes.error.text);
          },
        });

      this.subscription.add(addCatSub);
    } else if (this.refViewModel.checkCategoryExist(this.name)) {
      alert('This Category has exist already!! Please try new....');
    }
  }

  deleteFunc(): void {
    let ids: number[] = [];
    if (this.mainIds.length > 0) {
      ids = ids.concat(this.mainIds);
    }

    if (this.sub1Ids.length > 0) {
      ids = ids.concat(this.sub1Ids);
    }

    if (this.sub2Ids.length > 0) {
      ids = ids.concat(this.sub2Ids);
    }

    if (ids.length > 0) {
      const deleteCatSub = this.categoriesViewModel
        .deleteCategory(ids)
        .subscribe((res) => {
          if (typeof res === 'number' && res > 0) {
            this.mainCategories = this.mainCategories.filter(
              (main) => !ids.includes(main.refCategoryId)
            );
            this.sub1Categories = this.sub1Categories.filter(
              (sub1) =>
                !ids.includes(sub1.refCategoryId) &&
                !ids.includes(sub1.parentId)
            );
            this.sub2Categories = this.sub2Categories.filter(
              (sub2) =>
                !ids.includes(sub2.refCategoryId) &&
                !ids.includes(sub2.parentId) &&
                this.sub1Categories
                  .map((cat) => cat.refCategoryId)
                  .includes(sub2.parentId)
            );
            this.mainIds = [];
            this.sub1Ids = [];
            this.sub2Ids = [];
            this.refViewModel.removeCategoriesByIds(ids);
            alert('Delete Category complete!!');
          } else {
            if (res !== null && typeof res !== 'number') {
              const errorRes = res as HttpErrorResponse;
              alert(errorRes.error.text);
            } else {
              alert('Have some problem! Please try again');
            }
          }
        });

      this.subscription.add(deleteCatSub);
    }
  }

  updateNameFunc(): void {
    if (this.selectId !== 0 && this.name !== '') {
      const icon = this.getCatIcon().replace(EndPoint.MainUri + 'files/', '');
      const updateNameSub = this.categoriesViewModel
        .updateNameCategory(this.selectId, this.name, icon, this.pendingFile)
        .subscribe({
          next: (res) => {
            if (res > 0) {
              if (
                this.mainCategories.find(
                  (cat) => cat.refCategoryId === this.selectId
                ) !== undefined
              ) {
                const index = this.mainCategories.findIndex(
                  (cat) => cat.refCategoryId === this.selectId
                );
                this.mainCategories[index].name = this.name;
                if (this.pendingFile !== null) {
                  this.mainCategories[index].icon =
                    EndPoint.MainUri + 'files/' + this.pendingFile.name;
                }
              } else if (
                this.sub1Categories.find(
                  (cat) => cat.refCategoryId === this.selectId
                ) !== undefined
              ) {
                const index = this.sub1Categories.findIndex(
                  (cat) => cat.refCategoryId === this.selectId
                );
                this.sub1Categories[index].name = this.name;

                if (this.pendingFile !== null) {
                  this.sub1Categories[index].icon =
                    EndPoint.MainUri + 'files/' + this.pendingFile.name;
                }
              } else if (
                this.sub2Categories.find(
                  (cat) => cat.refCategoryId === this.selectId
                ) !== undefined
              ) {
                const index = this.sub2Categories.findIndex(
                  (cat) => cat.refCategoryId === this.selectId
                );
                this.sub2Categories[index].name = this.name;
                if (this.pendingFile !== null) {
                  this.sub2Categories[index].icon =
                    EndPoint.MainUri + 'files/' + this.pendingFile.name;
                }
              }
            }
          },
          error: (err) => {
            const errorRes = err as HttpErrorResponse;
            alert(errorRes.error.text);
          },
          complete: () => {
            this.refViewModel.updateCategoryName(
              this.selectId,
              this.name,
              this.pendingFile.name
            );
            this.pendingFile = null;
            this.previewFile = '';

            this.showEditModalFunc(0, 0, '');
          },
        });
      this.subscription.add(updateNameSub);
    }
  }

  updateOrderIndexFunc(categories: IRefCategory[]): void {
    let data: { RefCategoryId: number; OrderIndex: number }[] = categories.map(
      (cat) => {
        return {
          RefCategoryId: cat.refCategoryId,
          OrderIndex: cat.orderIndex,
        };
      }
    );

    if (data.length > 0) {
      this.updateOrderIndexSubject.next(data);
    }
  }

  showAddModalFunc(index: number): void {
    if (!this.showAddModal) {
      this.showAddModal = true;
      switch (index) {
        case 0:
          this.parentId = 1;
          break;
        case 1:
          this.parentId = this.cat1Id;
          break;
        case 2:
          this.parentId = this.cat2Id;
          break;
      }
    } else {
      this.name = '';
      this.showAddModal = false;
      this.parentId = 1;
    }
  }

  showEditModalFunc(id: number, index: number, name: string): void {
    if (!this.showEditModal) {
      this.showEditModal = true;
      this.selectId = id;
      this.name = name;
      switch (index) {
        case 0:
          this.parentId = 1;
          break;
        case 1:
          this.parentId = this.cat1Id;
          break;
        case 2:
          this.parentId = this.cat2Id;
          break;
      }
    } else {
      this.parentId = 1;
      this.selectId = 0;
      this.name = '';
      this.showEditModal = false;
    }
  }

  getCatIcon(): string {
    return this.refViewModel.getCategoryById(this.selectId).icon;
  }

  onDropFile(fileList: FileList): void {
    if (!this.inprocess) {
      this.inprocess = true;
      const file: File = fileList.item(0);
      const mimeType = file.type;
      if (mimeType.match(/image\/*/) == null) {
        alert('This file is not image : ' + file.name);
        this.inprocess = false;
        return;
      }

      if (file.size > 500000) {
        alert(`File size of ${file.name} is over 500kb can not upload`);
        this.inprocess = false;
        return;
      } else if (file.size < 5000) {
        alert(`File size of ${file.name} is less 5kb can not upload`);
        this.inprocess = false;
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.pendingFile = file;
        this.previewFile = reader.result as string;
        this.inprocess = false;
      };
    }
  }

  deleteIconFunc(): void {
    if (this.pendingFile !== null) {
      this.clearIconFunc();
    }
    else if (!this.inprocess && !this.getCatIcon().includes('no-icon.png')) {
      this.inprocess = true;
      this.apiCategories.deleteIcon(this.selectId).subscribe({
        next: () => {
          if (
            this.mainCategories.find(
              (cat) => cat.refCategoryId === this.selectId
            ) !== undefined
          ) {
            const index = this.mainCategories.findIndex(
              (cat) => cat.refCategoryId === this.selectId
            );

            this.mainCategories[index].icon =
              EndPoint.MainUri + 'files/no-icon.png';
          } else if (
            this.sub1Categories.find(
              (cat) => cat.refCategoryId === this.selectId
            ) !== undefined
          ) {
            const index = this.sub1Categories.findIndex(
              (cat) => cat.refCategoryId === this.selectId
            );

            this.sub1Categories[index].icon =
              EndPoint.MainUri + 'files/no-icon.png';
          } else if (
            this.sub2Categories.find(
              (cat) => cat.refCategoryId === this.selectId
            ) !== undefined
          ) {
            const index = this.sub2Categories.findIndex(
              (cat) => cat.refCategoryId === this.selectId
            );
            this.sub2Categories[index].icon =
              EndPoint.MainUri + 'files/no-icon.png';
          }
        },
        error: err => {
          alert(err.error.text);
          console.log(err);
        },
        complete: () => {
          this.refViewModel.updateCategoryName(
            this.selectId,
            this.name,
            'no-icon.png'
          );

          this.inprocess = false;
        }
      });
    }
  }

  clearIconFunc(): void{
    this.pendingFile = null;
    this.previewFile = '';
  }
}
