import { Component, OnInit } from '@angular/core';

import { IProductVariants } from 'src/app/pages/vendors/dto/interfaces/i-product-variants';
import { ISelectCourier } from 'src/app/shared/components/select-courier/interfaces/i-select-courier';
import { ISelectForwarder } from 'src/app/shared/components/select-forwarder/interfaces/i-select-forwarder';
import { ToastService } from 'src/app/toast/toast-service';
import { ShipmentApiService } from '../../api/shipment-api.service';
import { IShipment } from '../../dto/interfaces/i-shipment';
import { IShipmentVendorProducts } from '../../dto/interfaces/i-shipment-vendor-products';
import { ShipmentViewModel } from '../../view-model/shipment-view-model.service';

@Component({
  selector: 'app-add-shipment-modal',
  templateUrl: './add-shipment-modal.component.html',
  styleUrls: ['./add-shipment-modal.component.scss'],
})
export class AddShipmentModalComponent implements OnInit {
  constructor(
    public vmShipment: ShipmentViewModel,
    private apiShipment: ShipmentApiService,
    private toast: ToastService
  ) {}

  //#region NoNo
  showSelectCourier = false;
  showSelectForwarder = false;
  courierName: string;
  forwarderName: string = '--';
  selTr = 0;
  //#endregion NoNo

  ngOnInit(): void {}

  getItemsCount(): number {
    return this.vmShipment.vendorProducts.length;
  }

  posEventEmmit($event: any): void {
    this.vmShipment.posVendorProd = $event;
  }

  vendorProductList(): IShipmentVendorProducts[] {
    let copyItems: IShipmentVendorProducts[] = Object.assign(
      [],
      this.vmShipment.vendorProducts
    );

    if (copyItems.length > 20) {
      return copyItems.splice(this.vmShipment.posVendorProd * 20, 20);
    } else {
      return copyItems;
    }
  }

  getVariant(variants: IProductVariants[], refvarid: number): string {
    if (variants.length === 0) {
      return '';
    }
    const variant = variants.find((f) => f.refVariantId == refvarid);

    if (variant == undefined) {
      return '';
    }

    return variant.variantValue;
  }

  validateShippedQty(vp: IShipmentVendorProducts): void {
    if (vp.shippedQty > vp.remainingQty) {
      alert('shipped qty is more than remaining qty.');
      vp.shippedQty = 0;
    }

    this.vmShipment.vendorProducts.forEach((f) => {
      if (f.orderDetailId == vp.orderDetailId) {
        f.hasUpdate = true;
      }
    });
  }

  postNewShipment(): void {
    if (
      this.vmShipment.vendorProducts.filter((f) => f.hasUpdate == true)
        .length == 0
    ) {
      alert('You must place a least 1 product in  shipment.');
      return;
    }

    if (this.vmShipment.selectedVendor.purchasingVendorId == 0) {
      alert('select a vendor.');
      return;
    }

    // if (
    //   this.vmShipment.addShipmentModel.refCourierId == 1 ||
    //   this.vmShipment.addShipmentModel.trackingNo.length == 0
    // ) {
    //   alert('Fill up shipment form fields.');
    //   return;
    // }





    const dtNow = new Date();
    const dt = dtNow.toISOString().split('T')[0];

    const selDt = new Date(this.vmShipment.addShipmentModel.shipmentDate);
    const dtNowR = new Date(dt);

    const selDtR = selDt.toISOString().split('T')[0];
    const dtSelDtr = new Date(selDtR);
    if(this.vmShipment.addShipmentModel.trackingNo === ''){
      alert('push Tracking No.');
      return;

    }

    this.toast.doToast();
    this.vmShipment.addShipmentModel.shipmentProducts = this.vmShipment.vendorProducts
      .filter((f) => f.hasUpdate && f.shippedQty > 0)
      .map((m) => {
        const model = {
          orderDetailId: m.orderDetailId,
          shippedQty: m.shippedQty,
          orderId: m.orderId,
        };
        return model;
      });



     let listPod = this.vmShipment.addShipmentModel.shipmentProducts.filter(f => f.shippedQty !== 0);

      if(listPod.length > 0){
        // (this.vmShipment.addShipmentModel.refForwarderId = 34)?this.vmShipment.addShipmentModel.refForwarderId = 1:"";
        this.apiShipment.addShipment(this.vmShipment.addShipmentModel).subscribe(
          (res: IShipment) => {
            if (res.shipmentId !== undefined) {
              const newlist: IShipment[] = [];
              newlist.push(res);
              this.vmShipment.shipmentList.forEach((p) => newlist.push(p));
              this.vmShipment.shipmentList = newlist;
            }
          },
          (err) => {},
          () => {
            this.vmShipment.vendorModal = false;
            this.vmShipment.resetter();
            this.toast.closeToast();
          }
        );
      }else{
        alert('You must place a least 1 product in  shipment.');
        this.toast.closeToast();
        return;
      }


  }

  chackToolTip(char: number, max: number): boolean {
    if (char > max) {
      return true;
    } else {
      return false;
    }
  }

  //#region  NoNo Function
  onSelectCourier(courier: ISelectCourier): void {
    this.vmShipment.addShipmentModel.refCourierId = courier.courierId;
    this.courierName = courier.courierName;
  }

  onSelectForwarder(forwarder: ISelectForwarder): void {
    this.vmShipment.addShipmentModel.refForwarderId = forwarder.forwarderId;
    this.forwarderName = forwarder.forwarderName;
  }

  clearSelectCourier(): void {
    this.vmShipment.addShipmentModel.refCourierId = 0;
    this.courierName = '';
  }

  clearSelectForwarder(): void {
    this.vmShipment.addShipmentModel.refForwarderId = 34;
    this.forwarderName = '--';
  }

  onHasNewCourier(courier: ISelectCourier): void {
    this.vmShipment.addNewCourier(courier);
  }
  onHasNewForwarder(forwarder: ISelectForwarder): void {
    this.vmShipment.addNewForwarder(forwarder);
  }
  //#endregion NoNo Function
}
