import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { IVendorProduct } from '../../dto/interfaces/i-vendor-product';
import { ToastService } from 'src/app/toast/toast-service';
import { IProductVariants } from '../../dto/interfaces/i-product-variants';
import { SortingPipe } from '../../pipe/sorting.pipe';
import { VendorsViewModel } from '../../view-model/vendors-view-model';

@Component({
  selector: 'app-vendor-product',
  templateUrl: './vendor-product.component.html',
  styleUrls: ['./vendor-product.component.scss']
})
export class VendorProductComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  position = 0;
  searchProduct: string;
  activeSel = 0;

  constructor(
    public vmVendors: VendorsViewModel,
    private toast: ToastService,
    private pipe: SortingPipe
  ) { }

  ngOnInit(): void {
    // this.getVendorProductByVendorId();
  }


  // getVendorProductByVendorId(): void {
  //   this.toast.doToast();
  //   const productSub = this.vmVendors.getVendorProductByvendorId(this.vmVendors.vendorId).subscribe(
  //     (res) => {
  //       this.vmVendors.setVendorProduct(this.pipe.transform(res, 'productId'));
  //     },
  //     (err) => console.log(err),
  //     () => {
  //       this.subscriptions.push(productSub);
  //       this.toast.closeToast();
  //     }
  //   );
  // }

  getVendorPodCount(): number {
    return this.vmVendors.vendorProduct.length;
  }

  getPagePosition($event): void {
    this.position = $event;
  }

  getProduct(): Observable<IVendorProduct[]> {
    let product: IVendorProduct[] = [];

    const copyItems = Object.assign([], this.vmVendors.vendorProduct);
    if (copyItems.length > 200) {
      product = copyItems.splice(this.position * 200, 200);
    } else {
      product = copyItems;
    }
    return of(product);
  }

  chackToolTip(char: number, max: number): boolean {
    if (char > max) {
      return true;
    } else {
      return false;
    }
  }

  getVariant(variants: IProductVariants[], varianttype: number): string {
    return variants.find((f) => f.refVariantId === varianttype) !== undefined
      ? variants.find((f) => f.refVariantId === varianttype).variantValue
      : '-';
  }

  searchVendorProduct(): void {
    if (this.searchProduct !== '') {
      const searchVenorProductSub = this.vmVendors
        .searVendorProduct(this.vmVendors.vendorId, this.searchProduct)
        .subscribe(
          (res) => {
            this.vmVendors.setVendorProduct(this.pipe.transform(res, 'productId'));
          },
          (err) => console.log(err),
          () => {
            this.subscriptions.push(searchVenorProductSub);
          }
        );
    } else {
      const productSub = this.vmVendors.getVendorProductByvendorId(this.vmVendors.vendorId).subscribe(
        (res) => {
          this.vmVendors.setVendorProduct(this.pipe.transform(res, 'productId'));
        },
        (err) => console.log(err),
        () => {
          this.subscriptions.push(productSub);
          this.toast.closeToast();
        }
      );
    }
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

}
