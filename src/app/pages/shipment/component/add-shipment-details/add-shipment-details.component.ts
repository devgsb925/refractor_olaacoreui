import { Component, OnInit } from '@angular/core';
import { IProductVariants } from 'src/app/pages/vendors/dto/interfaces/i-product-variants';
import { ToastService } from 'src/app/toast/toast-service';
import { ShipmentApiService } from '../../api/shipment-api.service';
import { IShipmentVendorProducts } from '../../dto/interfaces/i-shipment-vendor-products';
import { MAddShipmentDetails } from '../../dto/model/m-add-shipment-details';
import { MAddShipmentDetailsList } from '../../dto/model/m-add-shipment-details-list';
import { ShipmentViewModel } from '../../view-model/shipment-view-model.service';

@Component({
  selector: 'app-add-shipment-details',
  templateUrl: './add-shipment-details.component.html',
  styleUrls: ['./add-shipment-details.component.scss'],
})
export class AddShipmentDetailsComponent implements OnInit {
  activeTr = 0;
  selTr = 0;
  constructor(
    public vmShipment: ShipmentViewModel,
    private apiShipment: ShipmentApiService,
    private toast: ToastService,


  ) {}

  ngOnInit(): void {
    const prodids = this.vmShipment.shipmentDetails.map(
      (m) => m.orderDetailsId
    );
    this.vmShipment.vendorProducts = this.vmShipment.vendorProducts.filter(
      (f) => !prodids.includes(f.orderDetailId)
    );

    if (this.vmShipment.vendorProducts.length == 0) {
      alert('All orders has been selected.');
      this.closeAddShipmentDetaiModal();
    }
  }

  getItemsCount(): number {
    return this.vmShipment.vendorProducts.length;
  }

  posEventEmmit($event: any): void {
    this.vmShipment.posAddShipmentDetail = $event;
  }

  addShipmentDetailList(): IShipmentVendorProducts[] {
    let copyItems: IShipmentVendorProducts[] = Object.assign(
      [],
      this.vmShipment.vendorProducts
    );

    if (copyItems.length > 20) {
      return copyItems.splice(this.vmShipment.posAddShipmentDetail * 20, 20);
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
    vp.hasUpdate = true;

    if (vp.shippedQty > vp.remainingQty) {
      alert('shipped qty is more than remaining qty.');
      vp.shippedQty = vp.remainingQty;
    }
  }

  closeAddShipmentDetaiModal(): void {
    this.vmShipment.addShipmentDetailModal = false;
    this.vmShipment.vendorProducts = [];
    this.vmShipment.selectedVendor.purchasingVendorId = 0;
    this.vmShipment.selectedVendor.selected = false;
  }

  postAddNewShipmentDetailsItems(): void {
    this.toast.doToast();

    const model: MAddShipmentDetailsList = {
      shipmentDetailsItems: this.vmShipment.vendorProducts
        .filter((f) => f.hasUpdate == true && f.shippedQty > 0)
        .map((m) => {
          const mapModel: MAddShipmentDetails = {
            purchasingOrderDetailId: m.orderDetailId,
            purchasingShipmentId: this.vmShipment.selectedShipmentId,
            shippedQty: m.shippedQty,
            orderId: m.orderId,
          };

          return mapModel;
        }),
    };

    this.apiShipment.addShipmentDetail(model).subscribe(
      (res) => {
        if (res > 0) {
          this.closeAddShipmentDetaiModal();
        } else {
          alert('no changes has been made. please try again.');
        }
      },
      (err) => {
        console.log(err);
      },
      () => {
        this.toast.closeToast();

        this.apiShipment
          .getShipmentDetailByShipmentId(this.vmShipment.selectedShipmentId)
          .subscribe((res) => {
            this.vmShipment.shipmentDetails = res;
          });
      }
    );
  }

  chackToolTip(char: number, max: number): boolean {
    if (char > max) {
      return true;
    } else {
      return false;
    }
  }
}
