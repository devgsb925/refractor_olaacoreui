import { ISelectForwarder } from './../../../shared/components/select-forwarder/interfaces/i-select-forwarder';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRefCouriers } from '../dto/interfaces/i-ref-couriers';
import { IRefForwarders } from '../dto/interfaces/i-ref-forwarder';
import { IShipment } from '../dto/interfaces/i-shipment';
import { IShipmentDetail } from '../dto/interfaces/i-shipment-detail';
import { IShipmentVendorProducts } from '../dto/interfaces/i-shipment-vendor-products';
import { IShipmentVendor } from '../dto/interfaces/i-shipment-vendors';
import { IAddShipment } from '../dto/model/m-add-shipment';
import { MAddToStock } from '../dto/model/m-add-to-stock';
import { IUpdateJShipment } from '../dto/model/m-update-jshipment';
import { ISelectCourier } from 'src/app/shared/components/select-courier/interfaces/i-select-courier';
import { ProductReferencesViewModel } from 'src/app/view-model/product-references-view-model';
import { ShipmentApiService } from '../api/shipment-api.service';

@Injectable()
export class ShipmentViewModel {
  shipmentList: IShipment[] = [];
  masterShipment : IShipment[] = [];

  couriers: IRefCouriers[] = [];
  forwarders: IRefForwarders[] = [];

  posShipment = 0;
  posShipmentDetail = 0;
  posAddShipmentDetail = 0;
  posVendor = 0;
  posVendorProd = 0;

  vendorModal = false;
  editModal = false;
  addShipmentDetailModal = false;

  vendors: IShipmentVendor[] = [];
  vendorProducts: IShipmentVendorProducts[] = [];

  selectedShipmentId = 0;

  SELECT_ALL: boolean = false;

  public selectedVendor: IShipmentVendor = {
    purchasingVendorId: 0,
    vendorName: '',
    contactName: '',
    selected: false,
  };

  updateShipmentModel: IUpdateJShipment = {
    shipmentId: 1,
    shipmentDate: new Date(),
    shipmdentDateStr: '',
    refCourierId: 1,
    trackingNo: '',
    refForwarderId: 1,
    forwarderNo: '',
    noOfBoxes: 0,
    weight: 0.0,
    volume: 0,
    purchasingVendorId: this.selectedVendor.purchasingVendorId,
    shipmentProducts: [],
    hasUpdate: false,
  };

  addShipmentModel: IAddShipment = {
    shipmentId: 0,
    shipmentDate: new Date(),
    refCourierId: 1,
    trackingNo: '',
    refForwarderId: 1,
    forwarderNo: '',
    noOfBoxes: 0,
    weight: 0.0,
    volume: 0,
    purchasingVendorId: this.selectedVendor.purchasingVendorId,
    shipmentProducts: [],
  };

  shipmentDetails: IShipmentDetail[] = [];

  constructor(

    private apiShipment: ShipmentApiService
  ) {}

  convertDate(): string {
    return new Date(this.updateShipmentModel.shipmentDate).toISOString();
  }

  sorter(array: any, field: string): any[] {
    if (!Array.isArray(array)) {
      return;
    }
    array.sort((a: any, b: any) => {
      if (a[field] < b[field]) {
        return -1;
      } else if (a[field] > b[field]) {
        return 0;
      } else {
        return 1;
      }
    });
    return array.reverse();
  }

  closeAddShipmentModal(): void {
    this.resetter();
  }

  closeCloseVendorModal(): void {
    this.selectedVendor = {
      purchasingVendorId: 0,
      vendorName: '',
      contactName: '',
      selected: false,
    };

    this.vendorModal = false;
    this.vendors.forEach(f=>f.selected = false);
  }

  checkShipmentDetail(): boolean {
    return false;
  }

  resetter(): void {
    this.selectedVendor = {
      purchasingVendorId: 0,
      vendorName: '',
      contactName: '',
      selected: false,
    };

    this.addShipmentModel = {
      shipmentId: 0,
      shipmentDate: new Date(),
      refCourierId: 1,
      trackingNo: '',
      refForwarderId: 1,
      forwarderNo: '',
      noOfBoxes: 0,
      weight: 0.0,
      volume: 0,
      purchasingVendorId: this.selectedVendor.purchasingVendorId,
      shipmentProducts: [],
    };

    this.vendorProducts = [];
  }

  setShipmentDetails(sdetails: IShipmentDetail[]): void {
    this.shipmentDetails = sdetails;
  }

  setVendorProducts(vproducts: IShipmentVendorProducts[]): void {
    this.addShipmentModel.purchasingVendorId = this.selectedVendor.purchasingVendorId;
    this.vendorProducts = vproducts;
  }

  setShipment(shipments: IShipment[]): void {
    this.shipmentList = shipments;
  }

  setMasterShipment(msshipment: IShipment[]): void{
    this.masterShipment = msshipment;
  }

  setCouriers(couriers: IRefCouriers[]): void {
    this.couriers = couriers;
  }

  setForwarders(fowarders: IRefForwarders[]): void {
    this.forwarders = fowarders;
  }

  //#region NONO
  addNewForwarder(forwarder: ISelectForwarder): void{
    const newForwarder: IRefForwarders = {
      purchasingRefForwarderId: forwarder.forwarderId,
      companyName: forwarder.forwarderName,
      address: forwarder.address,
      dateCreate: forwarder.dateCreate
    };

    this.forwarders = [newForwarder].concat(this.forwarders);
  }

  addNewCourier(courier: ISelectCourier): void{
    const newForwarder: IRefCouriers = {
      purchasingRefCourierId: courier.courierId,
      companyName: courier.courierName,
      address: courier.address,
      dateCreate: courier.dateCreate
    };

    this.couriers = [newForwarder].concat(this.couriers);
  }

  getCourierName(id: number): string{
    return this.couriers.find(c => c.purchasingRefCourierId === id).companyName;
  }
  getForwarderName(id: number): string{
    return this.forwarders.find(f => f.purchasingRefForwarderId === id).companyName;
  }
  //#endregion

  setVendors(vendors: IShipmentVendor[]): void {
    this.vendors = vendors;
  }

  setSelectedVendor(vendors: IShipmentVendor[]): void {

    this.selectedVendor = vendors.find((f) => f.selected == true);

      if (this.selectedVendor !== undefined && this.selectedVendor.purchasingVendorId > 0) {
        this.vendorModal = false;
      } else {
        this.vendorModal = true;
      }
  }

  preSelectVendor(vendor: IShipmentVendor): void {
    this.vendors.forEach((f) => (f.selected = false));
    vendor.selected = true;
    this.selectedVendor = vendor;
  }

  checkAddShipmentParams(): boolean {
    if (
      this.selectedVendor.purchasingVendorId > 0 &&
      this.vendorModal == false && this.vendorProducts.length > 0
    ) {
      return true;
    }
    return false;
  }

  addToStock(model: MAddToStock): Observable<number> {
    return;
  }

  getForwarderById(fid: number): string{
    try {
      return this.forwarders.find(f => f.purchasingRefForwarderId === fid).companyName;
    } catch (error) {
      return '';
    }

  }

  sortingByDate(formdate: Date, todate: Date):Observable<any>{
    return this.apiShipment.sortingByDate(formdate, todate);
  }
}
