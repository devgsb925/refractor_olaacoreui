import { Component, OnInit } from '@angular/core';
import { IRefCategory } from 'src/app/api/products/references/interfaces/i-ref-category';
import { ProductReferencesViewModel } from 'src/app/view-model/product-references-view-model';
import { VmSalesReportService } from '../../vm/vm-sales-report.service';
import { IGetStock } from '../interface/i-get-stock';

@Component({
  selector: 'app-stock-fillter',
  templateUrl: './stock-fillter.component.html',
  styleUrls: ['./stock-fillter.component.scss']
})
export class StockFillterComponent implements OnInit {
  cat = false;
  catName = 'ALL Categories';
  brandName = '';
  showBrands = false;

  filterModel: IGetStock = {
    kw: '',
    brandId: 0,
    categoryId :0,
  }

  constructor(
    public vm:VmSalesReportService,
    public ref : ProductReferencesViewModel,
    ) { }

  ngOnInit(): void {
    (this.vm.catName !== 'ALL Categories')? this.catName = this.vm.catName: '';
    (this.vm.brandName !== 'ALL Brands')? this.brandName = this.vm.brandName: '';

  }


  onSelectCategory($event: IRefCategory): void {
    if($event[0] != undefined){
      this.vm.cat1IdSelect = $event[0];
      this.vm.stockFilter.categoryId = $event[0].refCategoryId;
      // this.vm.catName = $event[0].name;
      this.catName = $event[0].name;

    } else {
      this.vm.cat1IdSelect.name = '';
      this.vm.cat1IdSelect.refCategoryId = 0;
    }

    if($event[1] != undefined){
      this.vm.cat2IdSelect = $event[1];
      this.vm.stockFilter.categoryId = $event[1].refCategoryId;
      // this.vm.catName = $event[1].name;
      this.catName = $event[1].name;

    } else {
      this.vm.cat2IdSelect.name = '';
      this.vm.cat2IdSelect.refCategoryId = 0;
    }

    if($event[2] != undefined){
      this.vm.cat3IdSelect = $event[2];
      this.vm.stockFilter.categoryId = $event[2].refCategoryId;
      // this.vm.catName = $event[2].name;
      this.catName = $event[2].name;
    } else {
      this.vm.cat3IdSelect.name = '';
      this.vm.cat3IdSelect.refCategoryId = 0;
    }


    this.cat = false;
  }

  resetCat(): void{
    const recat: IRefCategory = {
      refCategoryId: 0,
      icon: '',
      name: 'Filter by categories',
      orderIndex: 0,
      parentId: 0,
      link: '',
      bannerUrl: ''
    };

    this.vm.cat1IdSelect = recat;
    this.vm.cat2IdSelect = recat;
    this.vm.cat3IdSelect = recat;
  }

  closeCat(): void{
    this.vm.stockFilter.categoryId = 0;
    this.catName = 'ALL Categories';
  }

  closeCategoryEvent($event: boolean) :void {
    this.cat = false;
    this.vm.productFilter.categories = 'ALL Categories';
    this.vm.catId = 0;
    this.resetCat();
  }

  searchBrandFunc(){
    this.showBrands = true;
    this.vm.brandName = this.brandName;
    this.vm.brands = this.ref.refBrandsList.filter( f=> f.name.toLocaleLowerCase().includes(this.brandName.toLocaleLowerCase()));
  }

  onSelectBrand(sel:string): void {
    this.brandName = sel;
    this.showBrands = false;
  }

  cancelBrand(): void{
    this.brandName = '';
    this.vm.brandName = '';
    this.vm.stockFilter.brandId = 0;

  }


  closeModal(): void{
    this.vm.stockFilterModal = false;
  }

  saveFillterSubmit(): void{

    this.vm.catName = this.catName;
    if(this.vm.brands.find(f => f.name === this.brandName) !== undefined){
      this.vm.stockFilter.brandId = this.vm.brands.find(f => f.name === this.brandName).refBrandId;
      this.vm.brandName = this.brandName;
    }

    this.vm.stockFilterModal = false;
  }
}
