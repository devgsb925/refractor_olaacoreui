import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IShipment } from '../interfaces/i-shipment';
import { StockInApiService } from '../stock-in-api.service';
import { IImei } from '../interfaces/i-imei';
import { IBarcode } from '../interfaces/i-barcode';
import { IShipmentDetail } from '../interfaces/i-shipment-detail';

@Injectable()
export class StockinActivesViewModel {
  constructor(private stockinApiService: StockInApiService) {}

  private productId = 0;
  private shipmentId = 0;
  private shipmentDetailId = 0;

  private shipmentIdsSub = new Subject<number[]>();

  private shipmentList: IShipment[] = [];
  private shipmentDetailList: IShipmentDetail[] = [];
  private imeiList: IImei[] = [];
  private barcodeList: IBarcode[] = [];


  //#region Set Func()
  setProductId(id: number): void {
    this.productId = id;
  }

  setShipmentId(id: number): void {
    this.shipmentId = id;
  }

  setShipmentIds(ids: number[]): void {
    this.shipmentIdsSub.next(ids);
  }

  setShipmentDetailId(id: number): void {
    this.shipmentDetailId = id;
  }

  setShipment(shipment: IShipment[]): void {
    this.shipmentList = shipment;
  }

  setShipmentDetail(shipmentDetail: IShipmentDetail[]): void {
    this.shipmentDetailList = shipmentDetail;
  }

  //#endregion

  //#region Get Func()
  getProductId(): number {
    return this.productId;
  }

  getShipById(id: number): IShipment[] {
    return this.shipmentList.filter((ship) => ship.shipmentId === id);
  }

  getShipByForwarderNo(no: string): IShipment[] {
    return this.shipmentList.filter((ship) => ship.forwarderNo.includes(no));
  }

  getShipByTrackingNo(no: string): IShipment[] {
    return this.shipmentList.filter((ship) => ship.trackingNo.includes(no));
  }

  getShipment(): IShipment[] {
    return this.shipmentList;
  }

  getBarcode(): IBarcode[] {
    return this.barcodeList;
  }

  getImei(): IImei[] {
    return this.imeiList;
  }

  getShipmentDetail(): IShipmentDetail[] {
    return this.shipmentDetailList.filter(
      (shipDetail) => shipDetail.purchasingShipmentId === this.shipmentId
    );
  }

  getImeiListByTableIndex(table: number): IImei[] {
    return this.imeiList
      .filter((imei) => imei.productId === this.productId)
      .slice((table - 1) * 20, 20 * table);
  }
  //#endregion

  //#region Read Func()
  readShipmentIncomplete(): Observable<IShipment[]> {
    return this.stockinApiService.getShipmentIncomplete();
  }

  readShipmetnDetailByShipmentId(): Observable<IShipmentDetail[]> {
    return this.shipmentIdsSub.pipe(
      switchMap((res) => {
        const model = {
          smids: res,
        };
        return this.stockinApiService.getShipmentDetailByShipmentIds(model);
      })
    );
  }
  //#endregion

  //#region Upload Remark Func()
  uploadShipmentDetail(): Observable<any> {
    const shipmentDetailModel = {
      shipmentId: this.shipmentId,
      updateShipmentDetails: this.shipmentDetailList.map((shipDetail) => {
        return {
          shipmentDetailId: shipDetail.purchasingShipmentDetailId,
          recieved: shipDetail.recieved,
          remark: shipDetail.remarks,
        };
      }),
    };
    return this.stockinApiService.updateShipmentDetail(shipmentDetailModel);
  }

  uploadImeiList(): Observable<any> {
    const imeiModel = {
      imeiList: this.imeiList,
    };
    return this.stockinApiService.addImeiCode(imeiModel);
  }

  uploadBarcode(): Observable<any> {
    const barcodeModel = {
      updateBarcodes: this.barcodeList,
    };
    return this.stockinApiService.updateBarcode(barcodeModel);
  }
  //#endregion

  updateRecieved(id: number, recieved: number): void {
    this.shipmentDetailList.find(
      (detailList) => detailList.purchasingShipmentDetailId === id
    ).recieved = recieved;
  }

  updateRemark(id: number, remark: string): void {
    this.shipmentDetailList.find(
      (detailList) => detailList.purchasingShipmentDetailId === id
    ).remarks = remark;
  }

  updateBarcode(pid: number, code: string): void {
    const barcode = this.barcodeList.find((bar) => bar.productId === pid);
    if (barcode === undefined) {
      this.barcodeList.push({ productId: pid, barcode: code });
    } else {
      this.barcodeList.find((bar) => bar.productId === pid).barcode = code;
    }
  }

  addImei(code: string): void {
    this.imeiList.push({
      imeiCode: code,
      shipmentDetailId: this.shipmentDetailId,
      productId: this.productId,
    });
  }

  removeItemFromImei(code: string): void {
    this.imeiList = this.imeiList.filter((imei) => imei.imeiCode !== code);
  }

  removeItemFromBarcode(code: string): void {
    this.barcodeList = this.barcodeList.filter(
      (barcode) => (barcode.barcode = code)
    );
  }

  resetImeiList(): void {
    this.imeiList = [];
  }

  resetBarcode(): void {
    this.barcodeList = [];
  }

  deleteImei(code: string): void {
    this.imeiList = this.imeiList.filter(
      (imei) => !(imei.productId === this.productId && imei.imeiCode === code)
    );
  }

  clearImei(): void {
    this.imeiList = this.imeiList.filter(
      (imei) => imei.productId !== this.productId
    );
  }

  checkStatusShipmentById(shipId: number): boolean {
    if (
      this.shipmentDetailList.find(
        (shipDetail) => shipDetail.purchasingShipmentId === shipId
      ) !== undefined
    ) {
      return this.shipmentDetailList.find(
        (shipDetail) =>
          shipDetail.purchasingShipmentId === shipId &&
          shipDetail.recieved !== shipDetail.shippedQty
      ) === undefined
        ? true
        : false;
    } else {
      return false;
    }
  }

  saveRemark(value): void {
    this.shipmentDetailList.find(
      (shipDetail) =>
        shipDetail.purchasingShipmentDetailId === this.shipmentDetailId
    ).remarks = value;
  }
}
