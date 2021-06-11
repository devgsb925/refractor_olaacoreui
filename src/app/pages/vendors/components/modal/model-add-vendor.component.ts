import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastService } from 'src/app/toast/toast-service';
import { ILoadVendor } from '../../dto/interfaces/i-load-vendor';
import { MAddVendor } from '../../dto/model/m-add-vendor';
import { VendorsViewModel } from '../../view-model/vendors-view-model';

@Component({
  selector: 'app-model-add-vendor',
  templateUrl: './model-add-vendor.component.html',
  styleUrls: ['./model-add-vendor.component.scss'],
})
export class ModelAddVendorComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  constructor(
    public vmVendors: VendorsViewModel,
    private toast: ToastService
  ) {}

  newModel: MAddVendor = {
    vendorName: '',
    shippingAddress: '',
    contactName: '',
    bankInfo: 'na',
    productTypes: '',
    city: '',
    zip: '',
    country: '',
    telephone: '',
    email: '',
    wechatId: '',
    bankAccountNumber: '',
    alipay: '',
    brand: '',
  };

  ngOnInit(): void {}

  addNewSaveSubmit(): void {
    this.toast.doToast();
    if (this.newModel.vendorName === '' || this.newModel.contactName === '') {
      alert('Plzz Enter Your Vendor Name , Contact Name');
      this.toast.closeToast();
    } else {
      const addNewSub = this.vmVendors.addNewVendor(this.newModel).subscribe(
        (res) => {

          if (res > 0) {
            const updateTable: ILoadVendor[] = [];
            const update: ILoadVendor = {
              vendorID: res,
              vendorName: this.newModel.vendorName,
              contactName: this.newModel.contactName,
              brand: this.newModel.brand,
              productType: this.newModel.productTypes,
              vendorStatus: 1,
            };

            updateTable.push(update);
            this.vmVendors.vendorTableList.forEach((itx) => {
              updateTable.push(itx);
            });

            this.vmVendors.setLoadVendor(updateTable);
            this.resetAddModel();
          }

          if (res === 'server error') {
            alert('Vendor is exist already.');
            this.resetAddModel();
          }
        },
        (err) => console.log(err),
        () => {
          this.subscriptions.push(addNewSub);
          this.vmVendors.addNewModal = false;
          this.toast.closeToast();
        }
      );
    }
  }

  resetAddModel(): void {
    this.newModel.vendorName = '';
    this.newModel.shippingAddress = '';
    this.newModel.contactName = '';
    this.newModel.bankInfo = '';
    this.newModel.productTypes = '';
    this.newModel.city = '';
    this.newModel.zip = '';
    this.newModel.country = '';
    this.newModel.telephone = '';
    this.newModel.email = '';
    this.newModel.wechatId = '';
    this.newModel.bankAccountNumber = '';
    this.newModel.alipay = '';
    this.newModel.brand = '';
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
}
