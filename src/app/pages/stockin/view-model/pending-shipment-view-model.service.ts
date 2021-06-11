import { IReceivedShipment } from './../components/received-shipment/dto/interface/i-received-shipment';
import { IShipmentDetail } from '../components/pending-shipment/dto/interfaces/i-shipment-detail';
import { BehaviorSubject, Observable } from 'rxjs';
import { RefStockin } from './../dto/interfaces/ref-stockin';
import { IUidGroup } from '../components/received-shipment/dto/interface/i-uid-group';
import { IProductBarcode } from './../components/received-shipment/dto/interface/i-product-barcode';
import { IPendingShipmentTable } from './../dto/interfaces/i-pending-shipment-table';
import { Injectable } from '@angular/core';
import { IReceivedShipmentTable } from '../dto/interfaces/i-received-shipment-table';
import { StockinService } from '../api/stockin.service';
import { MUpdateReceivedShipment } from '../components/received-shipment/dto/model/m-update-received-shipment';
import { MAddBarcode } from '../components/received-shipment/dto/model/m-add-barcode';
import { MDeleteUid } from '../components/received-shipment/dto/model/m-delete-uid';
import { IAddbarcodList } from '../components/received-shipment/dto/interface/i-addbarcod-list';

@Injectable()
export class PendingShipmentViewModelService {
  refstockin: RefStockin;

  pendingShipmentList: IPendingShipmentTable[] = [];
  selectedPendingShipment: IShipmentDetail;
  shipmentDetailModal = false;

  receivedShipment: IReceivedShipmentTable[] = [];
  selectReceivedDetail: IReceivedShipment;
  receivedShipmentModal = false;

  productBarcodeList: IProductBarcode[] = [];
  barcodeSelete: IProductBarcode;

  masterUidGroup: IUidGroup[] = [];
  barcode = false;
  modelBarcodeList: IUidGroup[] = [];

  uidGroupForPrint: IUidGroup[] = [];
  private dsUidGroupForPrint = new BehaviorSubject(this.uidGroupForPrint);
  UidGroupForPrin$ = this.dsUidGroupForPrint.asObservable();

  constructor(private apiStock: StockinService) {}

  setRefStockin(stock): void {
    this.refstockin = stock;
  }

  receivedQtyFlag(rqty: number, sqty: number): string {
    if (rqty < sqty && rqty !== 0) {
      return '#ff4747';
    }
    if (rqty > sqty && rqty !== 0) {
      return 'green';
    }
    if (rqty === sqty && rqty !== 0) {
      return '';
    }

    if (rqty === 0) {
      return '';
    }
  }

  //#region pending Shipment

  setPendingShipment(array): void {
    this.pendingShipmentList = [];
    this.pendingShipmentList = array;
  }

  searchPedingShipment(
    searchValue: string
  ): Observable<IPendingShipmentTable[]> {
    return this.apiStock.searchPedingShipment(searchValue);
  }

  getPendingShipmentDetails(sid: number): Observable<IShipmentDetail> {
    return this.apiStock.getPendingShipmentDetails(sid);
  }

  setPendingShipmentDetails(shipmentdetail: IShipmentDetail): void {
    this.selectedPendingShipment = shipmentdetail;
  }

  updatePendingShipmentDetail(model): Observable<number> {
    return this.apiStock.updatePendingShipment(model);
  }

  //#endregion

  //#region  Received Shipment

  setReceivedShipment(array: IReceivedShipmentTable[]): void {
    this.receivedShipment = [];
    this.receivedShipment = array;
  }

  setSelectReceivedDetail(detail: IReceivedShipment): void {
    detail.shipmentProducts.forEach((f) => (f.hasUpdate = false));
    this.selectReceivedDetail = detail;
  }

  searchReceivedShipment(
    searchValue: string
  ): Observable<IReceivedShipmentTable[]> {
    return this.apiStock.searchReceivedShipment(searchValue);
  }

  getReceivedShipmentDetail(shipmentId: number): Observable<IReceivedShipment> {
    return this.apiStock.getReceivedShipmentDetails(shipmentId);
  }

  onSubmitUpdateReceivedShipment(
    model: MUpdateReceivedShipment
  ): Observable<number> {
    return this.apiStock.onSubmitUpdateReceivedShipment(model);
  }

  //#endregion

  //#region  barcode

  setBarcodeForPrint(barcods: IUidGroup[]): void {
    this.uidGroupForPrint = [];
    this.uidGroupForPrint = barcods;
    this.dsUidGroupForPrint.next(this.uidGroupForPrint);
  }

  setProductBarCode(array: IProductBarcode[]): void {
    this.productBarcodeList = [];
    this.productBarcodeList = array;
  }

  setBarcodeSelete(model: IProductBarcode): void {
    this.barcodeSelete = model;
  }

  setMasterUidGroup(array: IUidGroup[]): void {
    this.masterUidGroup = array;
  }


  pushBarcodList(model:MAddBarcode ): void{
    const addModel : IUidGroup ={
      emeiId: 0,
      productId: model.productId,
      uidValue: model.uidValue,
      uidType: model.uidType, // 1 = IMEI, 2 = S/N, 3 = MAC, 0 = NONE
      hasSel: false,
    }
    this.modelBarcodeList.push(addModel);
  }

  loadBarcodeUiList(productid: number): Observable<IUidGroup[]> {
    return this.apiStock.loadBarcodeUiList(productid);
  }

  addBarcode(model: MAddBarcode): Observable<number> {
    return this.apiStock.addBarcode(model);
  }

  onDeleteSubmit(uidids: MDeleteUid): Observable<number> {
    return this.apiStock.onDeleteSubmit(uidids);
  }

  saveBarcodeList(mode: IAddbarcodList): Observable<number>{
   return this.apiStock.saveBarcodeList(mode);
  }
  //#endregion
}
