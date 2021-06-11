import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRefExchangeRate } from 'src/app/api/products/references/interfaces/i-ref-exchange-rate';
import { IRefCurrencyTypes } from 'src/app/api/products/references/interfaces/i-ref-refCurrencyTypes';
import { ProductReferencesViewModel } from 'src/app/view-model/product-references-view-model';
import { PageOrdersService } from '../../api/page-orders.service';
import { IOrderHistory } from '../../dto/interfaces/i-order-history';
import { EditOrderViewModelService } from '../edit-order/edit-order-view-model.service';

@Injectable()
export class OrderViewModelService {
  constructor(
    private orderApiService: PageOrdersService,
    private vmProductReferences: ProductReferencesViewModel
  ) {}

  private orderHistoryList: IOrderHistory[] = [];

  masterOrderHistOry : IOrderHistory[] = [];


  readOrderHistory(): Observable<IOrderHistory[]> {
    return this.orderApiService.orderTop50();
  }

  readOrderHistoryByVendorId(id): Observable<IOrderHistory[]> {
    return this.orderApiService.findOrderByVendorId(id);
  }

  readOrderHistoryByInvoice(no): Observable<IOrderHistory[]> {
    return this.orderApiService.findOrdersByInvoiceNo(no);
  }

  addOrderHistory(data: IOrderHistory[]): void {
    data = data.filter(
      (d) => !this.orderHistoryList.map((oh) => oh.orderId).includes(d.orderId)
    );
    this.orderHistoryList = this.orderHistoryList.concat(data);
  }

  setOrderHistory(data: IOrderHistory[]): void {
    this.orderHistoryList = data;
  }

  setMasterHistory(his: IOrderHistory[]): void{
    this.masterOrderHistOry = his;
  }

  sortingByStatus(sort:IOrderHistory[]): void{
    this.orderHistoryList = sort;
  }

  setOrderPaymentStatus(orderId: number, paymentStatus: number): void {
    this.orderHistoryList.find(
      (f) => f.orderId === orderId
    ).paymentStatus = paymentStatus;
  }

  getOrderHistory(): IOrderHistory[] {
    return this.orderHistoryList;
  }

  updateOrderPaymentStatus(
    orderId: number,
    status: number
  ): Observable<number> {
    const model = {
      orderId,
      status,
    };
    return this.orderApiService.updateOrderPaymentStatus(model);
  }

  getRefCurrencyTypes(): IRefCurrencyTypes[] {
    return this.vmProductReferences.getRefCurrencyTypes();
  }

  sortingByDate(sdate: string, todata: string): Observable<any>{
    return this.orderApiService.sortingByDate(sdate, todata)
  }

  searchOrderByInvoiceNo(inv : string):Observable<any>{
    return this.orderApiService.searchOrderByInvoiceNo(inv);
  }

  searchOrder(kw : string): Observable<any>{
    return this.orderApiService.searchOrder(kw);
  }


  getShipemntIdsByOrderId(orderid): Observable<any>{
   return this.orderApiService.getShipmentByid(orderid)
  }

}
