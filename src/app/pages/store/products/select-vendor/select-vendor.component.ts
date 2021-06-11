import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { IVendor } from '../../../../shared/components/vendors/i-vendor';
import { ApiVendorService } from 'src/app/shared/components/vendors/api-vendor.service';
import { VmVendorService } from 'src/app/shared/components/vendors/vm-vendor.service';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-select-vendor',
  templateUrl: './select-vendor.component.html',
  styleUrls: ['./select-vendor.component.scss'],
})
export class SelectVendorComponent implements OnInit, OnDestroy {
  constructor(private api: ApiVendorService, public vm: VmVendorService) {}

  searchValue = '';

  private subscription = new Subscription();

  @Output() selectItem = new EventEmitter<IVendor>();
  @Output() closeEvent = new EventEmitter<boolean>();

  ngOnInit(): void {
    if (this.vm.getLength() == 0) {
      const vendorSub = this.api.getList('', 0, 1000).subscribe({
        next: res => {
          this.vm.setVendors(res);
        }
      });
      this.subscription.add(vendorSub);
    }
  }

  ngOnDestroy(): void{
    this.subscription.unsubscribe();
  }

  getVendors = () =>
    this.vm.vendors$.pipe(
      map((vendor) =>
        vendor.filter(
          (v) =>
            v.purchasingVendorId.toString().slice(0, this.searchValue.length) ==
              this.searchValue ||
            v.vendorName
              .toLowerCase()
              .includes(this.searchValue.toLowerCase()) ||
            v.contactName.toLowerCase().includes(this.searchValue.toLowerCase())
        )
      )
    );

  selectItemFunc(item: IVendor): void {
    this.selectItem.next(item);
    this.closeEvent.next(true);
  }
}
