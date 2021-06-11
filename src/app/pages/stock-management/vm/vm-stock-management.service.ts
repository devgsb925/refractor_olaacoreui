import { Injectable } from '@angular/core';
import { IRefBrands } from 'src/app/api/products/references/interfaces/i-ref-brands';
import { IRefCategory } from 'src/app/api/products/references/interfaces/i-ref-category';
import { IStockManagementProducts } from '../interfaces/i-stock-management-products';

@Injectable()
export class VmStockManagementService {

  selected_stockmgt: IStockManagementProducts;

  postDataList: IStockManagementProducts[] = [];

  stockManagementBool = true;
  distributionLogsBool = false;
  inventoryLogsBool = false;

  showSelectCategory = false;
  showSelectBrands = false;

  showRemarksModal = false;
  remarks = '';

  prodLength = 0;
  pagePos = 0;

  sortCheck = 0;
  sortDate = false;
  sortStatus = 0;
  selectAll = false;

  products: IStockManagementProducts[] = [];

  cat1IdSelect: IRefCategory = {
    refCategoryId: 0,
  icon: '',
  name: 'Filter by categories',
  orderIndex: 0,
  parentId: 0,
  link: '',
  bannerUrl: ''
  };

  cat2IdSelect: IRefCategory = {
    refCategoryId: 0,
  icon: '',
  name: 'Filter by categories',
  orderIndex: 0,
  parentId: 0,
  link: '',
  bannerUrl: ''
  };

  cat3IdSelect: IRefCategory = {
    refCategoryId: 0,
  icon: '',
  name: 'Filter by categories',
  orderIndex: 0,
  parentId: 0,
  link: '',
  bannerUrl: ''
  };


  selectedBrand: IRefBrands = {
    refBrandId: 0,
    name: 'Filter by brand',
    orderIndex: 0,
    url: ''
  }

  keyword = '';

  showDistributeModal = false;

  constructor() { }

  sortItems(array: any, field: string): any[] {
    if (!Array.isArray(array)) {
      return;
    }
    array.sort((a: any, b: any) => {
      if (a[field] > b[field]) {
        return -1;
      } else {
        return 1;
      }
    });
    return array;
  }

  onChangeTab(tab: number): void {
    if(tab === 0) {
      this.stockManagementBool = true;
      this.distributionLogsBool = false;
      this.inventoryLogsBool = false;
    } else if (tab === 1) {
      this.stockManagementBool = false;
      this.distributionLogsBool = true;
      this.inventoryLogsBool = false;
    } else if (tab === 2) {
      this.stockManagementBool = false;
      this.distributionLogsBool = false;
      this.inventoryLogsBool = true;
    }
  }

  getPagePosition($event): void {
    this.pagePos = $event;
  }

  getProducts(): IStockManagementProducts[] {
    let prods: IStockManagementProducts[] = [];

    const copyItems = Object.assign([], this.products);

    this.prodLength = copyItems.length;

    if (copyItems.length > 150) {
      prods = copyItems.splice(this.pagePos * 150, 150);
    } else {
      prods = copyItems;
    }

    return prods;
  }

  getUidTypeName(uidType: number): string {


    if(uidType === 1) {
      return 'IMEI'; // 1 = IMEI, 2 = S/N, 3 = MAC, 0 = NONE
    } else if(uidType === 2) {
      return 'S/N'; // 1 = IMEI, 2 = S/N, 3 = MAC, 0 = NONE
    } else if(uidType === 3) {
      return 'MAC'; // 1 = IMEI, 2 = S/N, 3 = MAC, 0 = NONE
    } else {
      return '';
    }
  }
}
