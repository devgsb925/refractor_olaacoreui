import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { ToastService } from 'src/app/toast/toast-service';
import { VendorsViewModel } from '../../../view-model/vendors-view-model';
import { IOrderDetail } from './i-order-detail';
import { IProduct } from './i-product';

@Component({
  selector: 'app-vendor-order-detail',
  templateUrl: './vendor-order-detail.component.html',
  styleUrls: ['./vendor-order-detail.component.scss']
})
export class VendorOrderDetailComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  position = 0;
  selTr = 0;
  disNext = false;
  disBack = false;
  constructor(
    public vmVendor: VendorsViewModel,
    private toast: ToastService,
  ) { }


  ngOnInit(): void {
    this.getOrderDetails(this.vmVendor.vendorId);
  }



  getOrderDetails(vid: number): void {
    this.toast.doToast();
    const od = this.vmVendor.orderByOrderId(vid).subscribe((res: IOrderDetail) => {
      this.vmVendor.setOrderDetail(res);
    }, (err) => console.log(err),
      () => {
        this.subscriptions.push(od);
        this.toast.closeToast();
      }

    )
  }

  closeFunc(): void {
    this.vmVendor.detailModal = false;
  }

  getOrderDetailCount(): number {
    return this.vmVendor.orderDetail.orderDetails.length;
  }

  getPagePosition($event): void {
    this.position = $event;
  }

  getOrderDetail(): Observable<IProduct[]> {
    let detail: IProduct[] = [];

    const copyItems = Object.assign([], this.vmVendor.orderDetail.orderDetails);
    if (copyItems.length > 100) {
      detail = copyItems.splice(this.position * 100, 100);
    } else {
      detail = copyItems;
    }
    return of(detail);
  }

  nextFunc(id: number, option: number): void {

    if (option === 1) {

      const orderList = this.vmVendor.vendorOrder;
      let index;
      index = orderList.findIndex(f => f.orderId === id);

      if (orderList.length+1 > index) {
        index += 1;
        this.disBack = false;

        if(orderList.length !== index){

        const newDetail = this.vmVendor.orderByOrderId(orderList[index].orderId).subscribe((res) => {
          this.vmVendor.setOrderDetail(res);
        }, (err) => console.log(err),
          () => {
            this.subscriptions.push(newDetail);
          }
        )
        }else{
        this.disNext = true;
        }

      }

    } else {

      const orderList = this.vmVendor.vendorOrder;
      let index;
      index = orderList.findIndex(f => f.orderId === id);
      this.disNext = false;
      if (index + 1 > 1) {
        index -= 1;
        const newDetail = this.vmVendor.orderByOrderId(orderList[index].orderId).subscribe((res) => {
          this.vmVendor.setOrderDetail(res);
        }, (err) => console.log(err),
          () => {
            this.subscriptions.push(newDetail);
          }
        )
      } else {
       this.disBack = true;
      }

    }



  }



  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

}
