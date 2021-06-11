import { Component, Input } from '@angular/core';

import { IRefCategory } from 'src/app/api/products/references/interfaces/i-ref-category';
import { IRefBrands } from 'src/app/pages/orders/components/edit-order/model/i-ref-brands';
import { IStockDistribution} from '../../interfaces/i-stock-distribution';
@Component({
  selector: 'app-tab-stock-distribution',
  templateUrl: './tab-stock-distribution.component.html',
  styleUrls: ['./tab-stock-distribution.component.scss']
})
export class TabStockDistributionComponent {

  @Input() products: IStockDistribution[] = [];
  prodPos = 0;
  prodLength = 0;

  selectAll = false;

  showSelectCategory = false;

  showSelectBrands = false;

  cat1IdSelect: IRefCategory = {
    refCategoryId: 0,
  icon: '',
  name: '',
  orderIndex: 0,
  parentId: 0
  };

  cat2IdSelect: IRefCategory = {
    refCategoryId: 0,
  icon: '',
  name: '',
  orderIndex: 0,
  parentId: 0
  };

  cat3IdSelect: IRefCategory = {
    refCategoryId: 0,
  icon: '',
  name: '',
  orderIndex: 0,
  parentId: 0
  };


  private selectedBrand: IRefBrands = {
    refBrandId: 0,
    name: 'Filter by brand',
    orderIndex: 0,
  }

  onSelectBrand(sel: IRefBrands) : void {

    this.selectedBrand.name = sel.name;
    this.selectedBrand.refBrandId = sel.refBrandId;
    this.showSelectBrands = false;
  }

  getBrandName(): string {
    return this.selectedBrand.name;
  }

  closeCategoryEvent($event: boolean) :void {


    this.showSelectCategory = false;
  }

  closeBrandEvent($event: boolean) :void {
    if($event == false) {
      this.selectedBrand.name = 'Filter by brand';
      this.selectedBrand.refBrandId = 0;
    }
    this.showSelectBrands = false;
  }


  getCategoryName(): string {

    if(this.cat3IdSelect.refCategoryId > 0){
      return this.cat3IdSelect.name;
    }

    if(this.cat2IdSelect.refCategoryId > 0){
      return this.cat2IdSelect.name;
    }

    if(this.cat1IdSelect.refCategoryId > 0){
      return this.cat1IdSelect.name;
    }

    return 'Filter by category';
  }

  onSelectCategory($event: IRefCategory): void {

    if($event[2] != undefined){
      this.cat3IdSelect = $event[2];
    } else {
      this.cat3IdSelect.name = '';
      this.cat3IdSelect.refCategoryId = 0;
    }


    if($event[1] != undefined){
      this.cat2IdSelect = $event[1];
    } else {
      this.cat2IdSelect.name = '';
      this.cat2IdSelect.refCategoryId = 0;
    }

    if($event[0] != undefined){
      this.cat1IdSelect = $event[0];
    } else {
      this.cat1IdSelect.name = '';
      this.cat1IdSelect.refCategoryId = 0;
    }


    this.showSelectCategory = false;
  }

  onSelectAll(): void {
    this.products.forEach(f=>f.select = this.selectAll);
  }

  posEventEmmit($event: any): void {
    this.prodPos = $event;
  }

  productList(): IStockDistribution[] {
    const copyItems: IStockDistribution[] = Object.assign(
      [],
      this.products
    );

    this.prodLength = copyItems.length;

    if (copyItems.length > 150) {
      return copyItems.splice(this.prodPos * 150, 150);
    } else {
      return copyItems;
    }
  }

}
