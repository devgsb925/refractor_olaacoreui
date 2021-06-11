import { Component, OnInit } from '@angular/core';
import { ProductsReferencesService } from 'src/app/api/products/references/products-references.service';
import { ToastService } from 'src/app/toast/toast-service';
import { ShipmentApiService } from '../../api/shipment-api.service';
import { IShipmentVendor } from '../../dto/interfaces/i-shipment-vendors';
import { ShipmentViewModel } from '../../view-model/shipment-view-model.service';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss'],
})
export class VendorsComponent implements OnInit {
  constructor(
    public vmShipment: ShipmentViewModel,
    private toast: ToastService,
    private apiShipment: ShipmentApiService,
    public vmRef: ProductsReferencesService,
  ) {}

  searchVendorValue = '';
  searchVendorOption = 0;
  inprocess = false;

  ngOnInit(): void {
    this.searchVendor();
  }

  getItemsCount(): number {
    return this.vmShipment.vendors.length;
  }

  posEventEmmit($event: any): void {
    this.vmShipment.posVendor = $event;
  }

  vendorList(): IShipmentVendor[] {
    let copyItems: IShipmentVendor[] = Object.assign(
      [],
      this.vmShipment.vendors
    );

    if (copyItems.length > 17) {
      return copyItems.splice(this.vmShipment.posVendor * 17, 17);
    } else {
      return copyItems;
    }
  }

  addShipment(): void {

    this.vmShipment.setSelectedVendor(this.vmShipment.vendors);

    if (this.vmShipment.selectedVendor.purchasingVendorId > 0) {
      this.toast.doToast();

      this.apiShipment
        .getShippingVendorProducts(
          this.vmShipment.selectedVendor.purchasingVendorId
        )
        .subscribe(
          (res) => {

            if(res.length > 0) {
              this.vmShipment.vendorModal = false;
              this.vmShipment.setVendorProducts(res);
            } else {

              this.vmShipment.selectedVendor.purchasingVendorId = 0;
              this.vmShipment.selectedVendor.selected = false;

              this.vmShipment.vendors.forEach(f=>f.selected = false);

              alert('No orders to be made. Make new orders and try again.');
            }
          },
          (err) => {
            console.log(err);
          },
          () => {
            this.toast.closeToast();
          }
        );
    } else {
      alert('you must select a vendor.');
    }
  }

  searchVendor(): void {
    if (!this.inprocess) {
      this.inprocess = true;
      this.vmRef
        .searchVendorWithOptionPayment(this.searchVendorValue)
        .toPromise()
        .then((res) => {
          const vendorShipment: IShipmentVendor[] = res.map((r) => {
            return { ...r, selected: false };
          });
          this.vmShipment.setVendors(vendorShipment);
          this.inprocess = false;
        }).catch(err => {
          alert(err.message);
          console.log(err);
          this.inprocess = false;
        });
    }
  }
}
