import { IVendorProduct } from './../dto/interfaces/i-vendor-product';
import { IVendorDetail } from './../dto/interfaces/i-vendor-detail';
import { ILoadVendor } from './../dto/interfaces/i-load-vendor';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VendorService } from '../api/vendor.service';
import { timeStamp } from 'console';
import { MAddVendor } from '../dto/model/m-add-vendor';
import { VendorOrder } from '../dto/interfaces/vendor-order';
import { IOrderDetail } from '../components/vendor-order/vendor-order-detail/i-order-detail';
import { ProductReferencesViewModel } from 'src/app/view-model/product-references-view-model';

@Injectable()
export class VendorsViewModel {
  constructor(
    private vendorService: VendorService,
    public vmRef: ProductReferencesViewModel,
    ) {}

  vendorTableList: ILoadVendor[] = [];
  vendorDetail: IVendorDetail;
  vendorProduct: IVendorProduct[] = [];
  vendorOrder: VendorOrder[] = [];
  masterVendorOrder:  VendorOrder[] = [];
  orderDetail: IOrderDetail;

  addNewModal = false;
  modalDetail = false;

  vendorId = 0;
  detailModal = false;


  vendors(kw: string): Observable<ILoadVendor> {
    return this.vendorService.vendors(kw);
  }

  setLoadVendor(vendorlist): void {
    this.vendorTableList = [];
    this.vendorTableList = vendorlist;
  }

  getVendorDetailByVendorId(vid: number): Observable<any> {
    return this.vendorService.getVendorDetailByVendorId(vid);
  }

  setVendorDetail(vendordetail): void {
    vendordetail.hasUpdate = false;
    this.vendorDetail = vendordetail;
  }

  getVendorProductByvendorId(vid: number): Observable<any> {
    return this.vendorService.getVendorProductByvendorId(vid);
  }

  setVendorProduct(pod): void {
    this.vendorProduct = [];
    this.vendorProduct = pod;
  }

  searVendorProduct(vendorId: number, searchValue: string): Observable<any> {
    return this.vendorService.searVendorProduct(vendorId, searchValue);
  }

  updateVendor(model: IVendorDetail): Observable<any> {
    return this.vendorService.updateVendor(model);
  }

  addNewVendor(model): Observable<any> {
    return this.vendorService.addNewVendor(model);
  }

  getVendorOrderByvendorId(vid: number): Observable<VendorOrder[]>{
    return this.vendorService.getVendorOrderByvendorId(vid);
  }

  setVendorOrder(vorder: VendorOrder[]): void{
    this.vendorOrder = [];
    this.vendorOrder = vorder;
  }

  setMasterVendorOrder(vorder: VendorOrder[]): void{
    this.masterVendorOrder = [];
    this.masterVendorOrder = vorder;
  }

  orderByOrderId(orderid: number): Observable<any>{
   return this.vendorService.orderByOrderId(orderid);
  }

  setOrderDetail(data : IOrderDetail): void{
    this.orderDetail = data;
  }

  getCurrencyByid(crid: number): string{
    return this.vmRef.refCurrencyTypes.find(f => f.purchasingRefCurrencyTypeId === crid).currencyName;
  }

}
