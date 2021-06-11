import { ProductReferencesViewModel } from './../../../../view-model/product-references-view-model';

import { OrdersViewModelService } from './../../view-model/orders-view-model.service';
import { AddOrderDetailViewModelService } from './add-order-detail-view-model.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';

// lar code
import { IVendorList } from './dto/interface/i-vendor-list';
import { IProductTable } from './dto/interface/i-product-table';
import { MAddModel } from './dto/model/m-add-model';
// end lar code

@Component({
  selector: 'app-add-order-detail',
  templateUrl: './add-order-detail.component.html',
  styleUrls: ['./add-order-detail.component.scss'],
})
export class AddOrderDetailComponent implements OnInit, OnDestroy {
  searchValue = '';
  position = 0;

  private subscription = new Subscription();

  constructor(
    public addOrderDetailViewModel: AddOrderDetailViewModelService,
    public refViewModel: ProductReferencesViewModel,
    public ordersViewModel: OrdersViewModelService
  ) {}

  selTableRow = 0;

  ngOnInit(): void {
    const getProductSub = this.addOrderDetailViewModel
      .getProductByvendorId(this.ordersViewModel.order.vendorId)
      .subscribe(
        (res) => {
          this.addOrderDetailViewModel.setProductList(res);
        },
        (err) => console.log(err)
      );
    this.subscription.add(getProductSub);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  getVariantColor(id: number): string {
    const ids = this.addOrderDetailViewModel
      .getProductTable()
      .find((f) => f.productId === id).variantIds;
    return this.refViewModel.getColor(ids).variantValue;
  }

  getVariantSize(id: number): string {
    const ids = this.addOrderDetailViewModel
      .getProductTable()
      .find((f) => f.productId === id).variantIds;
    return this.refViewModel.getSize(ids).variantValue;
  }

  getVariantVersion(id: number): string {
    const ids = this.addOrderDetailViewModel
      .getProductTable()
      .find((f) => f.productId === id).variantIds;
    return this.refViewModel.getVersion(ids).variantValue;
  }

  getBrand(id: number): string {
    return this.refViewModel.getBrands().find((f) => f.refBrandId === id).name;
  }

  getVendorId(id: number): number {
    return this.addOrderDetailViewModel
      .getProductTable()
      .find((f) => f.productId === id).vendorList[0].vendorId;
  }

  getVendorDetail(id: number): IVendorList[] {
    return this.addOrderDetailViewModel
      .getProductTable()
      .find((f) => f.productId === id).vendorList;
  }

  chackToolTip(char: number, max: number): boolean {
    if (char > max) {
      return true;
    } else {
      return false;
    }
  }

  getItemCount(): number {
    return this.addOrderDetailViewModel.productList.length;
  }

  getPagePosition($event): void {
    this.position = $event;
  }

  getProductList(): Observable<IProductTable[]> {
    let productList: IProductTable[] = [];

    const copyItems = Object.assign(
      [],
      this.addOrderDetailViewModel.productList
    );
    if (copyItems.length > 20) {
      productList = copyItems.splice(this.position * 20, 20);
    } else {
      productList = copyItems;
    }

    return of(productList);
  }

  addSubmit(podid: number): void {
    const addModel: MAddModel = {
      orderId: this.ordersViewModel.order.orderId,
      vendorProductId: podid,
    };

    const addProductSub = this.addOrderDetailViewModel
      .addProductToOrder(addModel)
      .subscribe(
        (res) => {
          if (res !== []) {
            alert('Add Product Successful');
            this.updateUpdateAddNewProduct();
          } else {
            alert('Not have add any more!!');
          }
        },
        (err) => console.log(err)
      );
    this.subscription.add(addProductSub);
  }

  updateUpdateAddNewProduct(): void {
    const updateProductSub = this.addOrderDetailViewModel
      .getOrderDetail()
      .subscribe(
        (res) => {
          this.addOrderDetailViewModel.setOrderProduct(res);
        },
        (err) => console.log(err)
      );
    this.subscription.add(updateProductSub);
  }

  searchProduct(): void {
    if (this.searchValue !== '') {
      const searchProductSub = this.addOrderDetailViewModel
        .searchProduct(this.ordersViewModel.order.vendorId, this.searchValue)
        .subscribe(
          (res) => {
            console.log(res);

            this.addOrderDetailViewModel.setProductList(res);
          },
          (err) => console.log(err)
      );
      this.subscription.add(searchProductSub)
    } else {
      const getProductByVendorSub = this.addOrderDetailViewModel
        .getProductByvendorId(this.ordersViewModel.order.vendorId)
        .subscribe(
          (res) => {
            this.addOrderDetailViewModel.setProductList(res);
          },
          (err) => console.log(err)
      );
      this.subscription.add(getProductByVendorSub);
    }
  }
}
