import { MAddModel } from './dto/model/m-add-model';
import { AddOrderDetailApiService } from './add-order-detail-api.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { IProduct } from './i-product';

// lar code
import { IProductTable } from './dto/interface/i-product-table';
import { EditOrderViewModelService } from '../edit-order/edit-order-view-model.service';

// end lar code
@Injectable()
export class AddOrderDetailViewModelService {
  private products: IProduct[] = [];
  private vendorId = 0;

  constructor(
    private addOrderDetailApi: AddOrderDetailApiService,
    private VmEditVendor: EditOrderViewModelService
  ) {}

  productList: IProductTable[] = [];
  getProductByvendorId(vid: number): Observable<IProductTable[]> {
    return this.addOrderDetailApi.getProductByvendorId(vid);
  }

  setProductList(res): void {
    res.forEach((itx) => {
      itx.hasUpdate = false;
    });
    this.productList = [];
    this.productList = res;
  }

  getProductTable(): IProductTable[] {
    return this.productList;
  }

  addProductToOrder(model: MAddModel): Observable<any> {
    return this.addOrderDetailApi.addProductToOrder(model);
  }

  searchProduct(vid: number, saerchvalue: string): Observable<IProductTable[]> {
    return this.addOrderDetailApi.searchProduct(vid, saerchvalue);
  }

  checkHasItemInOrder(poid: number): boolean {
    if (this.VmEditVendor.getOrderDetail().find((f) => f.productId === poid)) {
      return true;
    } else {
      return false;
    }
  }

  getOrderDetail(): Observable<any> {
    return this.VmEditVendor.readOrderDetail();
  }

  setOrderProduct(array): void {
    this.VmEditVendor.addOrderDetails(array.orderDetails);
  }

  // end lar code
}
