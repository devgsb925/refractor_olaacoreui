import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { OrdersViewModelService } from '../../view-model/orders-view-model.service';
import { OrderViewModelService } from './order-view-model.service';
import { IOrderHistory } from '../../dto/interfaces/i-order-history';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit, OnDestroy {
  constructor(
    public orderViewModel: OrderViewModelService,
    private ordersViewModel: OrdersViewModelService,
    private datePipe: DatePipe
  ) {}

  private subscription = new Subscription();
  public searchOption = 0;
  public searchValue = '';
  position = 0;
  statusTab = false;
  selectStatus = -1;
  paymentTab = false;
  selectPayment = -1;
  startDate = '';
  toDate = '';
  selectSData = false;
  selectToDate = false;
  selectTable = 0;

  ngOnInit(): void {
    this.initOrder();
    this.startDate = this.datePipe.transform(new Date(),'yyyy-MM-dd') + 'T07:00';
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') + 'T19:00';
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private initOrder(): void {
    const orderHistorySub = this.orderViewModel
      .readOrderHistory()
      .subscribe((res) => {
        this.orderViewModel.setOrderHistory(res);
        this.orderViewModel.setMasterHistory(res);

      });
    this.subscription.add(orderHistorySub);
  }

  private initOrderByVendorId(): void {
    const orderHistorySub = this.orderViewModel
      .readOrderHistoryByVendorId(this.searchValue)
      .subscribe((res) => {
        this.orderViewModel.setOrderHistory(res);
        this.orderViewModel.setMasterHistory(res);
      });
    this.subscription.add(orderHistorySub);
  }

  private initOrderByInvoice(): void {
    const orderHistorySub = this.orderViewModel
      .readOrderHistoryByInvoice(this.searchValue)
      .subscribe((res) => {
      });
    this.subscription.add(orderHistorySub);
  }

  setPosition(e: number): void {

    this.position = e;
  }
  searchFunc(): void {
    if (this.searchValue !== '') {
      switch (this.searchOption) {
        case 0:
          this.initOrderByVendorId();
          break;
        case 1:
          this.initOrderByInvoice();
          break;
      }
    } else {
      this.initOrder();
    }
  }

  showEditOrderModalFunc(order): void {
    this.ordersViewModel.order = order;
    this.ordersViewModel.showEditOrderModal = true;
  }

  updateOrderToPaid(order: IOrderHistory, status: number): void {

    if(order.pOInvoiceNo.length === 0
      || order.purchasingRefCurrencyTypeId === 1 || order.rate === 0){
        alert('Requires invoice no, currency, rate and shipping cost.');
        return;
      }

    if (
      window.confirm('Are you sure to change Payment status of this Order?')
    ) {
      this.orderViewModel
        .updateOrderPaymentStatus(order.orderId, status)
        .subscribe((res) => {
          if (res > 0) {
            this.orderViewModel.setOrderPaymentStatus(order.orderId, status);
            this.initOrder();
          }
        });
    }
  }

  updateOrderToPending(orderId: number): void {
    if (
      window.confirm('Are you sure to change Payment status of this Order?')
    ) {
      this.orderViewModel
        .updateOrderPaymentStatus(orderId, 0)
        .subscribe((res) => {
          if (res > 0) {
            this.orderViewModel.setOrderPaymentStatus(orderId, 0);
          }
        });
    }
  }

  checkShipStatus(shipStatus: number, shipCount: number): string {
    if (shipCount !== 0) {
      if (shipStatus === 0) {
        return 'none';
      } else {
        return '#fcbf49';
      }
    } else {
      return 'none';
    }
  }

  checkRecievedStatus(
    recievedStatus: number,
    shipStatus: number,
  ): string {
    if (recievedStatus === 0) {
      if (shipStatus > 0) {
        return '#fcbf49';
      }else {
        return 'none';
      }
    }else if (recievedStatus === 1) {
      return 'red';
    } else {
      return 'green';
    }
  }

  getCurrency(exid: number): string {
    try {

      if(exid === 1){
        return '-'
      }else{
        return this.orderViewModel
        .getRefCurrencyTypes()
        .filter((f) => f.purchasingRefCurrencyTypeId === exid)[0].currencyName;
      }


    } catch (error) {
      return '';
    }
  }

  chackToolTip(char: number, max: number): boolean {
    if (char > max) {
      return true;
    } else {
      return false;
    }
  }

  statusChange(): void{
    this.statusTab = !this.statusTab;
    this.paymentTab = false;
  }

  sortingByStatus(id: number): void{
    this.selectStatus = id;
    const newList = this.orderViewModel.masterOrderHistOry.filter(f => f.orderStatus === this.selectStatus);
    (this.selectStatus === -1)?this.orderViewModel.sortingByStatus(this.orderViewModel.masterOrderHistOry): (newList.length > 0)?this.orderViewModel.sortingByStatus(newList):this.orderViewModel.sortingByStatus([]);
    this.position = 0;
  }

  paymentChange(): void{
    this.paymentTab = !this.paymentTab;
    this.statusTab = false;
  }

  sortingByPayment(id: number): void{
    this.selectPayment = id;
    const newList = this.orderViewModel.masterOrderHistOry.filter(f => f.paymentStatus === this.selectPayment);
    (this.selectPayment === -1)?this.orderViewModel.sortingByStatus(this.orderViewModel.masterOrderHistOry):(newList.length > 0)?this.orderViewModel.sortingByStatus(newList):this.orderViewModel.sortingByStatus([]);
    this.position = 0;
  }


  sortingByDate(){
    if(this.selectSData !== false && this.selectToDate !== false){
      const subSort = this.orderViewModel.sortingByDate(this.startDate , this.toDate).subscribe(res => {
          this.orderViewModel.setOrderHistory(res);
          this.orderViewModel.setMasterHistory(res);
      },(err)=> console.log(err),
      () => {
        this.subscription.add(subSort);
      }
      )
    }
  }

  searchOrder(): void{
    if(this.searchValue !== ''){
      const subSearch = this.orderViewModel.searchOrder(this.searchValue).subscribe(res => {
        console.log(res);

        this.orderViewModel.sortingByStatus(res);
      },(err)=> console.log(err),
      () => {
        this.subscription.add(subSearch);
      }
      )
    }else{
      this.orderViewModel.setOrderHistory(this.orderViewModel.masterOrderHistOry);
    }

  }

  changeFromDate(value: string): void{
    this.startDate = this.datePipe.transform(value,'yyyy-MM-dd') + 'T07:00';
    this.selectSData = true;
    this.sortingByDate();
  }

  changeToDate(value: string): void{
    this.toDate = this.datePipe.transform(value, 'yyyy-MM-dd') + 'T23:59';
    this.selectToDate = true;
    this.sortingByDate();
  }
}
