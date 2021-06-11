import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IVendor } from './i-vendor';

@Injectable()
export class VmVendorService {
  constructor() {}

  private vendors: IVendor[] = [];
  private dsVendors = new BehaviorSubject(this.vendors);
  vendors$ = this.dsVendors.asObservable();

  setVendors(data: IVendor[]): void {
    this.vendors = data;
    this.dsVendors.next(this.vendors);
  }

  getLength = () => this.dsVendors.value.length;

  getNameById = (id: number) =>
    this.dsVendors.value.find((vendor) => vendor.purchasingVendorId == id)
      .vendorName;
}
