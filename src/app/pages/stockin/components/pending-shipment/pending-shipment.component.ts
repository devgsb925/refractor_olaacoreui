import { Subscription } from 'rxjs';
import { PendingShipmentViewModelService } from './../../view-model/pending-shipment-view-model.service';
import { IPendingShipmentTable } from './../../dto/interfaces/i-pending-shipment-table';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastService } from 'src/app/toast/toast-service';


@Component({
  selector: 'app-pending-shipment',
  templateUrl: './pending-shipment.component.html',
  styleUrls: ['./pending-shipment.component.scss'],
})
export class PendingShipmentComponent implements OnInit, OnDestroy {
  posPendingShipment = 0;
  searchPendingShipment = '';
  subscription: Subscription[] = [];
  activeTr = 0;

  constructor(
    public vmPShipment: PendingShipmentViewModelService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {}

  getItemsCount(): number {
    return this.vmPShipment.pendingShipmentList.length;
  }

  posEventEmmit($event: any): void {
    this.posPendingShipment = $event;
  }

  pendingShipmentList(): IPendingShipmentTable[] {
    const copyItems: IPendingShipmentTable[] = Object.assign(
      [],
      this.vmPShipment.pendingShipmentList
    );

    if (copyItems.length > 20) {
      const newlist = copyItems.splice(this.posPendingShipment * 20, 20);
      return newlist;
    } else {
      return copyItems;
    }
  }

  detailButtonSubmit(pshipment: IPendingShipmentTable): void {
    this.toast.doToast();

    const shipmentDetailSub = this.vmPShipment
      .getPendingShipmentDetails(pshipment.shipmentId)
      .subscribe(
        (res) => {
          if (res !== undefined) {
            this.vmPShipment.setPendingShipmentDetails(res);
            this.vmPShipment.shipmentDetailModal = true;
          }
        },
        (err) => console.log(err),
        () => {
          this.subscription.push(shipmentDetailSub);
          this.toast.closeToast();
        }
      );
  }

  searchPedingShipment(): void {
    if (this.searchPendingShipment !== '') {
      const searchSub = this.vmPShipment
        .searchPedingShipment(this.searchPendingShipment)
        .subscribe(
          (res) => {
            this.vmPShipment.setPendingShipment(res.reverse());
          },
          (err) => console.log(err),
          () => {
            this.subscription.push(searchSub);
          }
        );
    } else {
      this.vmPShipment.setPendingShipment(
        this.vmPShipment.refstockin.pendingShipments
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }
}
