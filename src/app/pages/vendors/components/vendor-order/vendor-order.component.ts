import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProductReferencesViewModel } from 'src/app/view-model/product-references-view-model';
import { VendorOrder } from '../../dto/interfaces/vendor-order';
import { VendorsViewModel } from '../../view-model/vendors-view-model';

@Component({
  selector: 'app-vendor-order',
  templateUrl: './vendor-order.component.html',
  styleUrls: ['./vendor-order.component.scss']
})
export class VendorOrderComponent implements OnInit {

  position = 0
  searchValue: any;
  // detailModal = false;
  constructor(
    public vmVendor: VendorsViewModel,
    public vmRef : ProductReferencesViewModel,
  ) { }

  ngOnInit(): void {

  }

  getAmountLak(): number{
    if(this.vmVendor.vendorOrder.length > 0){
      const list = this.vmVendor.vendorOrder.map(m => m.totalAmount * m.rate).reduce(function(a, b){ return a + b; });
      return list;
    }
  }

  getVendorOrderCount(): number {
    return this.vmVendor.vendorOrder.length;
  }

  getPagePosition($event): void {
    this.position = $event;
  }

  getVendorOrder(): Observable<VendorOrder[]> {
    let order: VendorOrder[] = [];

    const copyItems = Object.assign([], this.vmVendor.vendorOrder);
    if (copyItems.length > 100) {
      order = copyItems.splice(this.position * 100, 100);
    } else {
      order = copyItems;
    }
    return of(order);
  }

  seachVendorOrder(): void{
   const searchData =  this.vmVendor.masterVendorOrder.filter(f =>
    f.pOInvoiceNo.toLowerCase().includes(this.searchValue) ||
    f.orderId == this.searchValue);
    this.vmVendor.setVendorOrder(searchData);
  }

  getCurrency(cid : number): string{
    if(cid !== 1){
      return this.vmRef.refCurrencyTypes.find(f => f.purchasingRefCurrencyTypeId === cid).currencyName;
    }else{
      return '-';
    }
  }


  oepnDetail(vid: number):void{
    this.vmVendor.vendorId = vid;
    this.vmVendor.detailModal = true;

  }

}
