import { Subscription } from 'rxjs';
import { IReceivedShipmentTable } from '../../dto/interfaces/i-received-shipment-table';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PendingShipmentViewModelService } from '../../view-model/pending-shipment-view-model.service';
@Component({
  selector: 'app-received-shipment',
  templateUrl: './received-shipment.component.html',
  styleUrls: ['./received-shipment.component.scss'],
})
export class ReceivedShipmentComponent implements OnInit, OnDestroy {
  posReceidved = 0;
  subscription: Subscription[] = [];
  searchReceived = '';
  selTr = 0;

  constructor(
    public vmPendingShipment: PendingShipmentViewModelService,
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription.forEach((f) => {
      f.unsubscribe();
    });
  }

  getItemsCount(): number {
    return this.vmPendingShipment.receivedShipment.length;
  }

  posEventEmmit($event: any): void {
    this.posReceidved = $event;
  }

  receivedShipmentList(): IReceivedShipmentTable[] {
    const copyItems: IReceivedShipmentTable[] = Object.assign([],this.vmPendingShipment.receivedShipment );

    if (copyItems.length > 20) {
      const newList = copyItems.splice(this.posReceidved * 20, 20);
      return newList;
    } else {
      return this.sortingFunc(copyItems, 'recievedDate') ;
    }
  }

  checkStatus(s: number): string {
    if (s === 0) {
      return 'Pending';
    }

    if (s === 1) {
      return 'Incomplete';
    }

    if (s === 2) {
      return 'Complete';
    }
  }

  detailSubmit(model: IReceivedShipmentTable): void {
    const detailSub = this.vmPendingShipment
      .getReceivedShipmentDetail(model.shipmentId)
      .subscribe(
        (res) => {
          if (res !== undefined) {
            this.vmPendingShipment.setSelectReceivedDetail(res);
            this.vmPendingShipment.receivedShipmentModal = true;
          }
        },
        (err) => console.log(err),
        () => {
          this.subscription.push(detailSub);
        }
      );
  }

  searchReceivedShipment(): void {
    if (this.searchReceived !== '') {
      const searchSub = this.vmPendingShipment
        .searchReceivedShipment(this.searchReceived)
        .subscribe(
          (res) => {
            this.vmPendingShipment.setReceivedShipment(
              res.reverse()
            );
          },
          (err) => console.log(err),
          () => {
            this.subscription.push(searchSub);
          }
        );
    } else {
      this.vmPendingShipment.setReceivedShipment(
       this.sortingFunc(this.vmPendingShipment.refstockin.recievedShipments, 'shipmentId')
      );
    }
  }

  sortingFunc(array: any, field: string){
    if (!Array.isArray(array)) {
      return;
    }
    array.sort((a: any, b: any) => {
      if (a[field] > b[field]) {
        return -1;
      } else {
        return 1;
      }
    });
    return array;
  }

}
