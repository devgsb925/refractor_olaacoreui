import { Component, OnInit } from '@angular/core';
import { VmSalesReportService } from '../../vm/vm-sales-report.service';
import { SalesReportApiService} from '../../sales-report-api.service';
import { IRefCategory } from 'src/app/api/products/references/interfaces/i-ref-category';
import { ProductReferencesViewModel } from 'src/app/view-model/product-references-view-model';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-filter-products-modal',
  templateUrl: './filter-products-modal.component.html',
  styleUrls: ['./filter-products-modal.component.scss']
})
export class FilterProductsModalComponent implements OnInit {

  showCategories:boolean = false;
  showBrands:boolean = false;
  cat = false;
  brandSearch = '';
  constructor(
    public vmSalesReport:VmSalesReportService,
    public salesReportApi : SalesReportApiService,
    public ref : ProductReferencesViewModel,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    ( this.vmSalesReport.productFilter.brand !== 'ALL Brands')? this.brandSearch = this.vmSalesReport.productFilter.brand: ''
  }

  saveSettings(): void {
    this.vmSalesReport.productFilter.show=false;

    if(this.vmSalesReport.productFilter.prodDate !== 'Custom') {
      this.vmSalesReport.productFilter.fromDt =  null;
      this.vmSalesReport.productFilter.toDt =  null;

      if( this.vmSalesReport.productFilter.categories ==='ALL Categories'){
        this.vmSalesReport.catId = 0;
      }else{
        this.vmSalesReport.catId = (this.vmSalesReport.categories.find(f => f.name)!== undefined)?this.vmSalesReport.categories.find(f => f.name).id: 0;
      }

    }else{

      this.vmSalesReport.productFilter.fromDt =  this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.vmSalesReport.productFilter.toDt =  this.datePipe.transform(new Date(), 'yyyy-MM-dd');

      if( this.vmSalesReport.productFilter.categories ==='ALL Categories'){
        this.vmSalesReport.catId = 0;
      }else{
        this.vmSalesReport.catId = (this.vmSalesReport.categories.find(f => f.name)!== undefined)?this.vmSalesReport.categories.find(f => f.name).id: 0;
      }

    }

  }

  onSelectCat(sel:string): void {
    this.vmSalesReport.productFilter.categories = sel;
    this.showCategories = false;
  }

  searchProduct(): void{
    if(this.vmSalesReport.productFilter.categories.length > 2){
      this.salesReportApi.getCategories(this.vmSalesReport.productFilter.categories)
      .subscribe(
        (res) => {
          this.vmSalesReport.categories = res;
          this.showCategories = true;
        }
      );
    }
  }

  onSelectBrand(sel:string): void {
    this.vmSalesReport.productFilter.brand = sel;
    this.brandSearch = sel;
    this.showBrands = false;
    this.vmSalesReport.brandId = this.vmSalesReport.brands.find(f => f.name === sel).refBrandId;
  }

  searchBrand(): void{

    if(this.vmSalesReport.productFilter.categories.length > 2){
      this.salesReportApi.getBrand(this.vmSalesReport.productFilter.brand)
      .subscribe(
        (res) => {
          this.vmSalesReport.brands = res;
          this.showBrands = true;
        }
      );
    }
  }

  searchBrnadV2(): void{
  this.showBrands = true;
  this.vmSalesReport.brands = this.ref.refBrandsList.filter( f=> f.name.toLocaleLowerCase().includes(this.brandSearch.toLocaleLowerCase()));
  }

  cancelBrand(): void{
    this.brandSearch = '';
    this.vmSalesReport.productFilter.brand = 'ALL Brands';
    this.vmSalesReport.brandId = 0;

  }

  getCategoryName(): string {

    if(this.vmSalesReport.cat3IdSelect.refCategoryId > 0){
      return this.vmSalesReport.cat3IdSelect.name;
    }

    if(this.vmSalesReport.cat2IdSelect.refCategoryId > 0){
      return this.vmSalesReport.cat2IdSelect.name;
    }

    if(this.vmSalesReport.cat1IdSelect.refCategoryId > 0){
      return this.vmSalesReport.cat1IdSelect.name;
    }

    return 'Filter by category';
  }

  onSelectCategory($event: IRefCategory): void {
    if($event[0] != undefined){
      this.vmSalesReport.cat1IdSelect = $event[0];
      this.vmSalesReport.productFilter.categories = $event[0].name;
      this.searchProduct();
    } else {
      this.vmSalesReport.cat1IdSelect.name = '';
      this.vmSalesReport.cat1IdSelect.refCategoryId = 0;
    }

    if($event[1] != undefined){
      this.vmSalesReport.cat2IdSelect = $event[1];
      this.vmSalesReport.productFilter.categories = $event[1].name;
      this.searchProduct();
    } else {
      this.vmSalesReport.cat2IdSelect.name = '';
      this.vmSalesReport.cat2IdSelect.refCategoryId = 0;
    }

    if($event[2] != undefined){
      this.vmSalesReport.cat3IdSelect = $event[2];
      this.vmSalesReport.productFilter.categories = $event[2].name;
      this.searchProduct();
    } else {
      this.vmSalesReport.cat3IdSelect.name = '';
      this.vmSalesReport.cat3IdSelect.refCategoryId = 0;
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

    this.vmSalesReport.cat1IdSelect = recat;
    this.vmSalesReport.cat2IdSelect = recat;
    this.vmSalesReport.cat3IdSelect = recat;
  }


  closeCategoryEvent($event: boolean) :void {
    this.cat = false;
    this.vmSalesReport.productFilter.categories = 'ALL Categories';
    this.vmSalesReport.catId = 0;
    this.resetCat();
  }

}
