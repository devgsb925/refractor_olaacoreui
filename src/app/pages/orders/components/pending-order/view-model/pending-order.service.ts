import { MDeletePendingOrder } from './../dto/model/m-delete-pending-order';
import { IPendingOrder } from './../dto/interface/i-pending-order';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { IVendorTable } from '../dto/interface/i-vendor-table';
import { PendingOrderListService } from '../api/pending-order-list.service';
import { MSeaerchPendingOrder } from '../dto/model/m-seaerch-pending-order';
import { stringify } from '@angular/compiler/src/util';
import { EndPoint } from 'src/app/security/end-point';

@Injectable()
export class PendingOrderService {
  pedingOrder: IPendingOrder[] = [];
  dsPedingOrder = new BehaviorSubject(this.pedingOrder);
  PedingOrder$ = this.dsPedingOrder.asObservable();

  vendorList: IVendorTable[] = [];
  private dsVendorList = new BehaviorSubject(this.vendorList);
  VendorList$ = this.dsVendorList.asObservable();

  masterPendingstock: IPendingOrder[] = [];
  masterVendorList :IVendorTable[] = [];
  position = 0;

  selTableVendorId = 0;

  constructor(private apiPendingOrderList: PendingOrderListService) {}

  setOrder(order: IPendingOrder[]): void {

    this.pedingOrder = order.map(o => {
      if (o.productImage) o.productImage = EndPoint.MainUri + 'files/' + o.productImage;
      o.hasSelect = false;
      o.hasUpdate = false;
      return o;
    });
    this.dsPedingOrder.next(this.pedingOrder);
  }

  setMasterOrderPending(orderPending): void {
    this.masterPendingstock = [];
    this.masterPendingstock = orderPending;
  }

  setVendor(vendor): void {
    this.vendorList = vendor;
    this.dsVendorList.next(this.vendorList);
  }

  setMasterVendorList(ven): void{
    this.masterVendorList = ven;
  }

  getVendor(): Observable<IVendorTable> {
    return this.apiPendingOrderList.getVendor();
  }

  selectOrderDetailByVendorid(vid: number): Observable<any> {
    return this.apiPendingOrderList.getOrderDetailByVendorId(vid);
  }

  searchVendor(option, searchValue): Observable<IVendorTable> {
    return this.apiPendingOrderList.searVender(option, searchValue);
  }

  searchOrder(model: MSeaerchPendingOrder): Observable<IPendingOrder[]> {
    return this.apiPendingOrderList.searchOrder(model);
  }

  removePendingOrder(model: MDeletePendingOrder): Observable<number> {
    return this.apiPendingOrderList.removePendingOrder(model);
  }

  updatePendingOrderList(model): Observable<number> {
    return this.apiPendingOrderList.updatePendingOrderList(model);
  }

  checkHasupdate(pendinglist): boolean {
    if (pendinglist.find((f) => f.hasUpdate === true)) {
      return true;
    } else {
      return false;
    }
  }

  submitPendingOrder(model): Observable<any> {
    return this.apiPendingOrderList.submitPendingOrder(model);
  }

  getItemCount(): number {
    return this.pedingOrder.length;
  }

  getPagePosition($event): void {
    this.position = $event;
  }

  getStocks(): Observable<IPendingOrder[]> {
    let pedingOrder: IPendingOrder[] = [];

    this.PedingOrder$.subscribe((res) => {
      const copyItems = Object.assign([], res);
      if (copyItems.length > 20) {
        pedingOrder = copyItems.splice(this.position * 20, 20);
      } else {
        pedingOrder = copyItems;
      }
    });

    return of(pedingOrder);
  }


  searchVendorList(kw : string): Observable<any>{
    return this.apiPendingOrderList.searchVendorList(kw);
  }

  searchVendorProductList(kw: string): Observable<any>{
    return this.apiPendingOrderList.searchVendorProductList(kw, this.selTableVendorId);
  }
}
