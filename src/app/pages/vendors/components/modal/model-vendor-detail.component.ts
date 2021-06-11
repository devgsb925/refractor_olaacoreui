import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastService } from 'src/app/toast/toast-service';
import { ILoadVendor } from '../../dto/interfaces/i-load-vendor';
import { IVendorDetail } from '../../dto/interfaces/i-vendor-detail';
import { VendorsViewModel } from '../../view-model/vendors-view-model';

@Component({
  selector: 'app-model-vendor-detail',
  templateUrl: './model-vendor-detail.component.html',
  styleUrls: ['./model-vendor-detail.component.scss'],
})
export class ModelVendorDetailComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  constructor(
    public vmVendors: VendorsViewModel,
    private toast: ToastService
  ) {}

  ngOnInit(): void {}

  saveEditButtonSubmit(detail: IVendorDetail): void {
    this.toast.doToast();

    const updateVendorSub = this.vmVendors.updateVendor(detail).subscribe(
      (res) => {
        if (res > 0) {
          this.vmVendors.modalDetail = false;

          this.vmVendors.vendorTableList.forEach(f=> {
            if(f.vendorID == detail.purchasingVendorId){
              f.vendorID = detail.purchasingVendorId;
              f.vendorName = detail.vendorName;
              f.contactName = detail.contactName;
              f.brand = detail.brand;
              f.productType = detail.productTypes;
              f.vendorStatus = detail.vendorStatus;
            }
          });

          this.vmVendors.setLoadVendor(this.vmVendors.vendorTableList);
        }
      },
      (err) => console.log(err),
      () => {
        this.subscriptions.push(updateVendorSub);
        this.toast.closeToast();
      }
    );
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
}
