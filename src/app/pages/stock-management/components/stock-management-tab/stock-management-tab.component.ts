import { Component, OnInit } from '@angular/core';
import { find } from 'rxjs/operators';
import { IRefBrands } from 'src/app/api/products/references/interfaces/i-ref-brands';
import { IRefCategory } from 'src/app/api/products/references/interfaces/i-ref-category';
import { StockManagementService } from '../../api/stock-management.service';
import { IDistributeProduct } from '../../interfaces/i-distribute-product';
import { IStockManagementProducts } from '../../interfaces/i-stock-management-products';
import { VmDistributeModalService } from '../../vm/vm-distribute-modal';
import { VmStockManagementService } from '../../vm/vm-stock-management.service';
import { IUid } from '../../interfaces/i-uid'

@Component({
  selector: 'app-stock-management-tab',
  templateUrl: './stock-management-tab.component.html',
  styleUrls: ['./stock-management-tab.component.scss']
})
export class StockManagementTabComponent implements OnInit {

  activeTr = 0;

  constructor(
    public vmStockManagementService: VmStockManagementService,
    private apiStockManagementService: StockManagementService,
    private vmDistributeModalService: VmDistributeModalService
  ) { }

  ngOnInit(): void {
    this.loadStockManagement();
  }

  onUpdateListEvent(e: IDistributeProduct): void {
    const prod = this.vmStockManagementService.products.find(f=>f.pId === e.pId);

    if(prod.smId == 0) {
      prod.qcFlag = 0;
      prod.demoFlag = 0;
      prod.stockFlag = 0;
      prod.warehouseFlag = 0;
      prod.displayFlag = 0;

      if(e.moveFrom == 'Warehouse') {
        prod.warehouseQty = e.unitInWarehouse - e.movedQty;
      } else if(e.moveFrom == 'Display') {
        prod.displayQty  = e.unitInDisplay - e.movedQty;
      } else if(e.moveFrom == 'Demo') {
        prod.demoQty  = e.unitInDemo - e.movedQty;
      } else if(e.moveFrom == 'QC') {
        prod.qcQty = e.unitInQc - e.movedQty;
      }

      if(e.to == 'Warehouse') {
        prod.warehouseQty = e.unitInWarehouse + e.movedQty;
      } else if(e.to == 'Display') {
        prod.displayQty  = e.unitInDisplay + e.movedQty;
      } else if(e.to == 'Demo') {
        prod.demoQty  = e.unitInDemo + e.movedQty;
      } else if(e.to == 'QC') {
        prod.qcQty = e.unitInQc + e.movedQty;
      }

    }

  }

  onClickDistribute(prod: IStockManagementProducts): void {

    const p:IStockManagementProducts[] = [];

    this.apiStockManagementService.getProductUids(prod.pId).subscribe(
      (res: IUid[]) => {

    p.push(prod);

    if(prod.pId > 0){
      let name = '';
      if(res.length > 0){
        name = this.vmStockManagementService.getUidTypeName(res[0].uidType);
      }

      const newProds = p.map(m=> {
        const product: IDistributeProduct = {
          pId: m.pId,
          sku: m.sku,
          productDesc: m.productDescription,
          uidName: '',
          stockQty: m.stockQty,
          unitInWarehouse: m.warehouseQty,
          unitInDisplay: m.displayQty,
          unitInDemo: m.demoQty,
          unitInQc: m.qcQty,
          unsave: false,
          moveBy: '',
          requestBy: '',
          moveFrom: '--select--',
          movedQty: 0,
          to: '--select--',
          remarks: '',
          uid: [],
          uidType: name,
          masterUidList: res
      };

      return product;

    });

    this.vmDistributeModalService.products = newProds;
    this.vmDistributeModalService.selected_product = newProds[0];


    this.vmDistributeModalService.products = newProds;

    this.vmStockManagementService.showDistributeModal = true;

    } else {
      alert('You must select item to distribute.');
    }
      });

  }

  clearIfNew(prod: IStockManagementProducts) : void {
    if(prod.smId === 0) {
      prod.remarks = '';
      prod.operatorCheck = 'Olaa Superadmin',
      prod.status = 0;
      prod.date = null;
    }
  }

  getCatId(): number {

    if(this.vmStockManagementService.cat3IdSelect.refCategoryId > 0) {
      return this.vmStockManagementService.cat3IdSelect.refCategoryId;
    }


    if(this.vmStockManagementService.cat2IdSelect.refCategoryId > 0) {
      return this.vmStockManagementService.cat2IdSelect.refCategoryId;
    }

    if(this.vmStockManagementService.cat1IdSelect.refCategoryId > 0) {
      return this.vmStockManagementService.cat1IdSelect.refCategoryId;
    }

    return null;
  }

  getBrandId(): number {
    if(this.vmStockManagementService.selectedBrand.refBrandId > 0){
      return this.vmStockManagementService.selectedBrand.refBrandId;
    } else {
      return null;
    }
  }

  getKw(): string {
    return this.vmStockManagementService.keyword.length === 0 ? null : this.vmStockManagementService.keyword;
  }

  searchStockManagement(): void {

    this.vmStockManagementService.selectAll = false;
    this.apiStockManagementService.getStockManagement(
      this.getCatId(), this.getBrandId(), this.getKw()).subscribe(
      (res) => {
        this.vmStockManagementService.products = res;
      }
    );
  }

  loadStockManagement(): void {
    this.apiStockManagementService.getStockManagement().subscribe(
      (res) => {


        res.forEach(prod => {

          if(prod.check === 0 && prod.smId > 0) {

            if(prod.stockQty > prod.invStockQty){
              prod.stockFlag = 1;
            } else if(prod.stockQty < prod.invStockQty){
              prod.stockFlag = 2;
            } else {
              prod.stockFlag = 0;
            }

            if(prod.warehouseQty > prod.invWarehouseQty){

              prod.warehouseFlag = 1;

            } else if(prod.warehouseQty < prod.invWarehouseQty){
              prod.warehouseFlag = 2;
            } else {
              prod.warehouseFlag = 0;
            }

            if(prod.displayQty > prod.invDisplayQty){
              prod.displayFlag = 1;
            } else if(prod.displayQty < prod.invDisplayQty){
              prod.displayFlag = 2;
            } else {
              prod.displayFlag = 0;
            }

            if(prod.demoQty > prod.invDemoQty){
              prod.demoFlag = 1;
            } else if(prod.demoQty < prod.invDemoQty){
              prod.demoFlag = 2;
            } else {
              prod.demoFlag = 0;
            }

            if(prod.qcQty > prod.invQcQty){
              prod.qcFlag = 1;
            } else if(prod.qcQty < prod.invQcQty){
              prod.qcFlag = 2;
            } else {
              prod.qcFlag = 0;
            }
          } else {
            prod.qcFlag = 0;
            prod.demoFlag = 0;
            prod.displayFlag = 0;
            prod.warehouseFlag = 0;
            prod.stockFlag = 0;
          }
        })



        this.vmStockManagementService.products = this.vmStockManagementService.sortItems(res, 'pId');
      }
    );
  }

  invStatus(prod: IStockManagementProducts): void {

    if(prod.invStockQty == undefined) {
      prod.invStockQty = 0;
    }
    if(prod.invWarehouseQty == undefined) {
      prod.invWarehouseQty = 0;
    }

    if(prod.invDisplayQty == undefined) {
      prod.invDisplayQty = 0;
    }

    if(prod.invDemoQty == undefined) {
      prod.invDemoQty = 0;
    }

    if(prod.invQcQty == undefined) {
      prod.invQcQty = 0;
    }

    prod.edit = false;
    prod.invStockQty = prod.invDisplayQty + prod.invDemoQty + prod.invQcQty + prod.invWarehouseQty;

    prod.touch = true;

    if(prod.stockQty > prod.invStockQty){
      prod.stockFlag = 1;
    } else if(prod.stockQty < prod.invStockQty){
      prod.stockFlag = 2;
    } else {
      prod.stockFlag = 0;
    }

    if(prod.warehouseQty > prod.invWarehouseQty){

      prod.warehouseFlag = 1;

    } else if(prod.warehouseQty < prod.invWarehouseQty){
      prod.warehouseFlag = 2;
    } else {
      prod.warehouseFlag = 0;
    }

    if(prod.displayQty > prod.invDisplayQty){
      prod.displayFlag = 1;
    } else if(prod.displayQty < prod.invDisplayQty){
      prod.displayFlag = 2;
    } else {
      prod.displayFlag = 0;
    }

    if(prod.demoQty > prod.invDemoQty){
      prod.demoFlag = 1;
    } else if(prod.demoQty < prod.invDemoQty){
      prod.demoFlag = 2;
    } else {
      prod.demoFlag = 0;
    }

    if(prod.qcQty > prod.invQcQty){
      prod.qcFlag = 1;
    } else if(prod.qcQty < prod.invQcQty){
      prod.qcFlag = 2;
    } else {
      prod.qcFlag = 0;
    }

  }

  onReCheck(prod: IStockManagementProducts): void {

    this.apiStockManagementService.reCheck(prod.smId).subscribe(
      (res) => {

        prod.qcQty = res.qcQty;
        prod.displayQty = res.displayQty;
        prod.stockQty = res.stockQty;
        prod.demoQty = res.demoQty;
        prod.warehouseQty = res.warehouseQty;

        prod.check = 0;
        prod.smId = 0;
        prod.invDemoQty = 0;
        prod.invDisplayQty = 0;
        prod.invQcQty = 0;
        prod.invStockQty = 0;
        prod.invWarehouseQty = 0;
        prod.operatorCheck = 'Olaa Superadmin';
        prod.qcFlag = 0;
        prod.demoFlag = 0;
        prod.stockFlag = 0;
        prod.displayFlag = 0;
        prod.warehouseFlag = 0;
      }
    );
  }

  onSubmit(): void {

    this.vmStockManagementService.postDataList = this.vmStockManagementService.products.filter(f=> f.touch === true);


    this.vmStockManagementService.postDataList.forEach(f => {

      if(f.smId === 0 && f.check === 0){

        f.date = null;
        f.operatorCheck = '',
        f.status = 0;
      }

    });

    if(this.vmStockManagementService.postDataList.length > 0) {
      this.apiStockManagementService.addOrUpdateStockManagement(this.vmStockManagementService.postDataList, 0).subscribe(
        (res) => {
          res.forEach(f=> {

            const findProd = this.vmStockManagementService.products.find(p=>p.pId === f.pId);
            findProd.smId = f.smId;

            if(findProd.status === 0){
              findProd.date = null;
            }

          });
        }
      );
    }

  }

  onProductCheck(prod: IStockManagementProducts): void {

    if(prod.invStockQty === 0){
      alert('there is no inventory data to check.');
      return;
    }
    this.vmStockManagementService.selected_stockmgt = prod;
    this.vmStockManagementService.showRemarksModal = true;
  }

  filterByStatus(): void {

    if(this.vmStockManagementService.sortStatus === 0){
      this.vmStockManagementService.sortStatus = 1;
    } else if(this.vmStockManagementService.sortStatus === 1){
      this.vmStockManagementService.sortStatus = 2;
    } else if(this.vmStockManagementService.sortStatus === 2){
      this.vmStockManagementService.sortStatus = 0;
    }

    if(this.vmStockManagementService.sortStatus === 2) {
      this.apiStockManagementService.getStockManagement(null, null, null, null, null, 2)
      .subscribe(
        (res) => {
          this.vmStockManagementService.products = res;
        }
      );
    }
    else  if(this.vmStockManagementService.sortStatus === 1) {
      this.apiStockManagementService.getStockManagement(null, null, null, null, null, 1)
      .subscribe(
        (res) => {
          this.vmStockManagementService.products = res;
        }
      );
    } else {
      this.apiStockManagementService.getStockManagement()
      .subscribe(
        (res) => {
          this.vmStockManagementService.products = res;
        }
      );
    }

  }

  filterByDateOrder(): void {

    this.vmStockManagementService.sortDate = !this.vmStockManagementService.sortDate;

    if(this.vmStockManagementService.sortDate) {

      const newList = this.vmStockManagementService.products.sort((b, a) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.vmStockManagementService.products = newList;

    }
    else if(!this.vmStockManagementService.sortDate) {
      const newList = this.vmStockManagementService.products.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.vmStockManagementService.products = newList;
    }
  }

  filterByCheck(): void {

    if(this.vmStockManagementService.sortCheck === 0){
      this.vmStockManagementService.sortCheck = 1;
    } else if(this.vmStockManagementService.sortCheck === 1){
      this.vmStockManagementService.sortCheck = 2;
    } else if(this.vmStockManagementService.sortCheck === 2){
      this.vmStockManagementService.sortCheck = 0;
    }

    if(this.vmStockManagementService.sortCheck === 2) {

      this.apiStockManagementService.getStockManagement(null, null, null, null, 1, null)
      .subscribe(
        (res) => {
          this.vmStockManagementService.products = res;
        }
      );

    }
    else  if(this.vmStockManagementService.sortCheck === 1) {
      this.apiStockManagementService.getStockManagement(null, null, null, null, 0, null)
      .subscribe(
        (res) => {
          this.vmStockManagementService.products = res;
        }
      );
    } else {
      this.apiStockManagementService.getStockManagement()
      .subscribe(
        (res) => {
          this.vmStockManagementService.products = res;
        }
      );
    }
  }

  getProductCount(): number {
    return this.vmStockManagementService.products.length;
  }

  getCheckCount(): number {
    return this.vmStockManagementService.products.filter(f=>f.check === 1).length;
  }

  //#region categories

  clearSelCat() : void {

    this.vmStockManagementService.cat1IdSelect.icon = '';
    this.vmStockManagementService.cat1IdSelect.name = 'Filter by categories';
    this.vmStockManagementService.cat1IdSelect.orderIndex = 3;
    this.vmStockManagementService.cat1IdSelect.parentId = 0;
    this.vmStockManagementService.cat1IdSelect.refCategoryId = 0;
    this.vmStockManagementService.cat2IdSelect.icon = '';
    this.vmStockManagementService.cat2IdSelect.name = 'Filter by categories';
    this.vmStockManagementService.cat2IdSelect.orderIndex = 3;
    this.vmStockManagementService.cat2IdSelect.parentId = 0;
    this.vmStockManagementService.cat2IdSelect.refCategoryId = 0;
    this.vmStockManagementService.cat3IdSelect.icon = '';
    this.vmStockManagementService.cat3IdSelect.name = 'Filter by categories';
    this.vmStockManagementService.cat3IdSelect.orderIndex = 3;
    this.vmStockManagementService.cat3IdSelect.parentId = 0;
    this.vmStockManagementService.cat3IdSelect.refCategoryId = 0;
  }

  onSelectCategory($event: IRefCategory): void {


    if($event[2] != undefined){
      this.vmStockManagementService.cat3IdSelect = $event[2];
    } else {
      this.vmStockManagementService.cat3IdSelect.name = '';
      this.vmStockManagementService.cat3IdSelect.refCategoryId = 0;
    }


    if($event[1] != undefined){
      this.vmStockManagementService.cat2IdSelect = $event[1];
    } else {
      this.vmStockManagementService.cat2IdSelect.name = '';
      this.vmStockManagementService.cat2IdSelect.refCategoryId = 0;
    }

    if($event[0] != undefined){
      this.vmStockManagementService.cat1IdSelect = $event[0];
    } else {
      this.vmStockManagementService.cat1IdSelect.name = '';
      this.vmStockManagementService.cat1IdSelect.refCategoryId = 0;
    }


    this.vmStockManagementService.showSelectCategory = false;
  }

  closeCategoryEvent($event: boolean) :void {

    this.vmStockManagementService.showSelectCategory = false;
  }

  getCategoryName(): string {

    if(this.vmStockManagementService.cat3IdSelect.refCategoryId > 0){
      return this.vmStockManagementService.cat3IdSelect.name;
    }

    if(this.vmStockManagementService.cat2IdSelect.refCategoryId > 0){
      return this.vmStockManagementService.cat2IdSelect.name;
    }

    if(this.vmStockManagementService.cat1IdSelect.refCategoryId > 0){
      return this.vmStockManagementService.cat1IdSelect.name;
    }

    return 'Filter by category';
  }

  //#endregion


  //#region brands


  closeBrandEvent($event: boolean) :void {
    if($event == false) {
      this.vmStockManagementService.selectedBrand.name = 'Filter by brand';
      this.vmStockManagementService.selectedBrand.refBrandId = 0;
    }
    this.vmStockManagementService.showSelectBrands = false;
  }

  onSelectBrand(sel: IRefBrands) : void {

    this.vmStockManagementService.selectedBrand.name = sel.name;
    this.vmStockManagementService.selectedBrand.refBrandId = sel.refBrandId;
    this.vmStockManagementService.showSelectBrands = false;
  }

  getBrandName(): string {
    return this.vmStockManagementService.selectedBrand.name;
  }

  clearSelBrand(): void {
    this.vmStockManagementService.selectedBrand.name = 'Filter by brand';
    this.vmStockManagementService.selectedBrand.orderIndex = 3;
    this.vmStockManagementService.selectedBrand.refBrandId = 0;
    this.vmStockManagementService.selectedBrand.url = '';
  }

  //#endregion


  posEventEmmit($event: any): void {
    this.vmStockManagementService.pagePos = $event;
  }

  chackToolTip(char: number, max: number): boolean {
    if (char > max) {
      return true;
    } else {
      return false;
    }
  }


  selTrFunc(pod: IStockManagementProducts):void{
    this.activeTr = pod.pId;
    if(pod.check !== 1 ){
      pod.edit = true;
    }
  }

}
