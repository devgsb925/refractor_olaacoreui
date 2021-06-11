import { Component, OnDestroy, OnInit } from '@angular/core';
import { VendorsViewModel } from './view-model/vendors-view-model';
import { ToastService } from '../../toast/toast-service';
import { Observable, of, Subscription } from 'rxjs';
import { IProductVariants } from './dto/interfaces/i-product-variants';
import { IVendorProduct } from './dto/interfaces/i-vendor-product';
import { SortingPipe } from './pipe/sorting.pipe';
import { ILoadVendor } from './dto/interfaces/i-load-vendor';
import { VendorOrder } from './dto/interfaces/vendor-order';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss'],
})
export class VendorsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  searchValue = '';
  vendorPos = 0;
  tab = 0;

  constructor(
    public vmVendors: VendorsViewModel,
    private toast: ToastService,
    private pipe: SortingPipe
  ) { }

  ngOnInit(): void {
    const vendorSub = this.vmVendors.vendors(this.searchValue).subscribe(
      (res) =>
        this.vmVendors.setLoadVendor(this.pipe.transform(res, 'vendorID')),
      (err) => console.log(err),
      () => {
        this.subscriptions.push(vendorSub);
      }
    );
  }

  getVendorDetailByvendorId(vid: number): void {
    this.toast.doToast();
    const vendorDetailSub = this.vmVendors
      .getVendorDetailByVendorId(vid)
      .subscribe(
        (res) => {

          this.vmVendors.setVendorDetail(res);
          this.vmVendors.modalDetail = true;
          this.vmVendors.vendorId = vid;
        },
        (err) => console.log(err),
        () => {
          this.subscriptions.push(vendorDetailSub);
          this.toast.closeToast();
        }
      );
  }

  sortingFunc(array: any, field: string) {
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


  getVariant(variants: IProductVariants[], varianttype: number): string {
    return variants.find((f) => f.refVariantId === varianttype) !== undefined
      ? variants.find((f) => f.refVariantId === varianttype).variantValue
      : '-';
  }

  getVendorCount(): number {
    return this.vmVendors.vendorTableList.length;
  }

  getVendorPagePosition($event): void {
    this.vendorPos = $event;
  }

  getVendor(): Observable<ILoadVendor[]> {
    let vendor: ILoadVendor[] = [];

    const copyItems = Object.assign([], this.vmVendors.vendorTableList);
    if (copyItems.length > 100) {
      vendor = copyItems.splice(this.vendorPos * 100, 100);
    } else {
      vendor = copyItems;
    }
    return of(vendor);
  }

  searchVendor(): void {

    const searchSub = this.vmVendors.vendors(this.searchValue).subscribe(
      (res) => {
        this.vmVendors.setLoadVendor(this.pipe.transform(res, 'vendorID'));
      },
      (err) => console.log(err),
      () => {
        this.subscriptions.push(searchSub);
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


  getVendorDetailByid(vid: number): void{
    this.toast.doToast();

    if(this.tab === 0){
      const orderSub = this.vmVendors.getVendorOrderByvendorId(vid).subscribe((res: VendorOrder[])=> {
        if(res.length > 0){
          this.vmVendors.vendorId = vid;
          this.vmVendors.setVendorOrder(res);
          this.vmVendors.setMasterVendorOrder(res);
        }else{
          this.vmVendors.setVendorOrder([]);
          this.vmVendors.vendorId = vid;
        }
      }, (err)=> console.log(err),
      ()=>{
        this.subscriptions.push(orderSub);
        this.toast.closeToast();
      }
      )
    }else{
      const productSub = this.vmVendors.getVendorProductByvendorId(vid).subscribe(
        (res) => {
          if(res.length > 0){
            this.vmVendors.setVendorProduct(this.pipe.transform(res, 'productId'));
            this.vmVendors.vendorId = vid;
          }else{
            this.vmVendors.setVendorProduct([]);
            this.vmVendors.vendorId = vid;
          }

        },
        (err) => console.log(err),
        () => {
          this.subscriptions.push(productSub);
          this.toast.closeToast();
        }
      );
    }
  }

  changeTabs(id: number): void{
    this.tab = id;
    this.getVendorDetailByid(this.vmVendors.vendorId);
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
}
