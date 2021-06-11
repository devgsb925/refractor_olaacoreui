import { IOrderDetails } from './../components/edit-order/interfaces/i-order-details';
import { Subject, Observable, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { IOrderHistory } from '../dto/interfaces/i-order-history';
import { IRefExchangeRate } from 'src/app/api/products/references/interfaces/i-ref-exchange-rate';

@Injectable()
export class OrdersViewModelService {

  subscription: Subscription;

  constructor() {}

  order: IOrderHistory;

  exchangeRate: IRefExchangeRate;

  tab = 1;

  showEditOrderModal = false;

  showAddOrderDetail = false;

  showExchangeRateModal = false;

  private newOrderDetailSubject = new Subject<IOrderDetails>();

  private prodIds: number[] = [];

  setProdIds(ids: number[]): void {
    this.prodIds = ids;
  }

  addProdId(id: number): void {
    this.prodIds.push(id);
  }

  checkExistingProd(pid: number): boolean {
    return this.prodIds.find((id) => id === pid) !== undefined;
  }

  public injectNewOrderDetail(orderDetail: IOrderDetails): void {
    this.newOrderDetailSubject.next(orderDetail);
  }

  public subscriptionNewOrderDetail(): Observable<IOrderDetails> {
    return this.newOrderDetailSubject;
  }

  onShipCostChange(cost: number): void {
    this.order.shipmentCost = cost;
  }

  onInvoiceChange(invioce: string): void {
    this.order.pOInvoiceNo = invioce;
  }

  setExchangeRate(rate: IRefExchangeRate): void {
    this.exchangeRate = rate;
  }

  getExchangeRate(): IRefExchangeRate {
    return this.exchangeRate;
  }
}
