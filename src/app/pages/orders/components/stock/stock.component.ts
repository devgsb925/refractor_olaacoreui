import { IVendorProduct } from './dto/interface/i-vendor-product';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { IProductInventory } from './dto/interface/i-product-inventory';
import { MAddPendinOrder } from './dto/model/m-add-pendin-order';
import { StockViewModelService } from './view-model/stock-view-model.service';
import { IProdVariants } from './dto/interface/i-prod-variants';
import { StockService } from './api/Stock.service';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
})
export class StockComponent implements OnInit, OnDestroy {


  search = '';
  selActiveBorder: number;

  quickEdit = 0;

  pos = 0;
  pageSize = 20;

  private subscription = new Subscription();
  private searchSubject = new Subject<string>();
  inprocess = false;

  constructor(public vm: StockViewModelService, private api: StockService) {}

  ngOnInit(): void {
    const searchSub = this.searchSubject.pipe(
      switchMap(res => {
        this.inprocess = true;
        return this.api.getList(res, 0, 200);
      })
    ).subscribe({
      next: res => {
        this.vm.setStock(res);
        this.inprocess = false;
      }
    });
    this.subscription.add(searchSub);
    this.searchSubject.next('');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  searchProduct(): void {
    this.searchSubject.next(this.search);
  }


  sliceFunc(stocks: IProductInventory[]): IProductInventory[]{
    return stocks.slice(this.pos * this.pageSize, (this.pos + 1) * this.pageSize);
  }

  updateStock(stock: IProductInventory[]): void {
    const filterItem = stock.filter((f) => f.hasUpdate);
    const updateModel = {
      updateStocks: filterItem.map((m) => {
        return {
          productId: m.productId,
          reorderQty: m.reOrder,
          remarks: m.remarks,
        };
      }),
    };

    const subUpdateModal = this.vm
      .updateProductStock(updateModel)
      .subscribe(
        (res) => {
          if (res) {
            this.quickEdit = 0;
          }
        },
        (err) => console.log(err),
        () => {
          stock.forEach((itx) => {
            itx.hasUpdate = false;
            itx.quickEditStock = false;
          });


        }
    );
    this.subscription.add(subUpdateModal);
  }

  addpendingOrder(stock: IProductInventory): void {
    const addModal: MAddPendinOrder = {
      storeProductId: stock.productId,
      requestedQty: 0,
      vendorProductIds: stock.vendorList.map((m) => m.vendorProductId),
    };

    const addPendingSub = this.vm.addpendingOrder(addModal).subscribe(
      (res) => {
        if (res > 0) {
          this.updateButtonAfterAdd(addModal.storeProductId);
        }
      },
      (err) => console.log(err),

    );
    this.subscription.add(addPendingSub);
  }

  updateButtonAfterAdd(stockid: number): void {
    this.vm.stocks.find(
      (f) => f.productId === stockid
    ).hasPendingOrder = true;
    this.vm.stocks = this.vm.stocks;
    this.vm.setStock((this.vm.stocks = this.vm.stocks));
  }

  checkHasUpdate(): boolean {
    if (this.vm.stocks.find((f) => f.hasUpdate === true)) {
      return true;
    } else {
      return false;
    }
  }

  getVariant(variants: IProdVariants[], varianttype: number): string {
    return variants.find((f) => f.refVariantId === varianttype) !== undefined
      ? variants.find((f) => f.refVariantId === varianttype).variantValue
      : '-';
  }

  chackToolTip(char: number, max: number): boolean {
    if (char > max) {
      return true;
    } else {
      return false;
    }
  }

  getVendorId(vendor: IVendorProduct): number {
    try {
      return vendor[0].vendorId;
    } catch (error) {
      return null;
    }
  }

  getVendordetail(vendor: IVendorProduct, type: number): string {
    if (type === 1) {
      try {
        return vendor[0].vendorName;
      } catch (error) {
        return '';
      }
    } else {
      try {
        return vendor[0].vendorContact;
      } catch (error) {
        return '';
      }
    }
  }

  getSku(pid: number):string{
    if(this.vm.stocks.find(f => f.productId === pid).sku !==""){
      return this.vm.stocks.find(f => f.productId === pid).sku;
    } else{
      return '-';
    }
  }


}
