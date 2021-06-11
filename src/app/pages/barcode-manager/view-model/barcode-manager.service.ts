import { Injectable } from '@angular/core';
import { IProduct } from '../dto/interfaces/I-product';
import { IUid } from '../dto/interfaces/i-uid';
import { BarcodeManagerApiService } from '../api/barcode-manager-api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { MAddBarcode } from '../dto/model/m-add-barcode';
import { MDeleteUid } from '../dto/model/m-delete-uid';

@Injectable()
export class BarcodeManagerService {
  productList: IProduct[] = [];
  masterUidList: IUid[] = [];
  uidList: IUid[] = [];

  barcodeSelete: IProduct;

  uidGroupForPrint: IUid[] = [];
  private dsUidGroupForPrint = new BehaviorSubject(this.uidGroupForPrint);
  UidGroupForPrin$ = this.dsUidGroupForPrint.asObservable();

  constructor(private apiBarcodeManager: BarcodeManagerApiService) {}

  setProductList(array: IProduct[]): void {
    this.productList = [];
    this.productList = array;
  }

  setUidList(array: IUid[]): void {
    this.uidList = [];
    this.uidList = array;
  }

  setMasterUidList(ms: IUid[]): void{
    this.masterUidList = [];
    this.masterUidList = ms;
  }

  setBarcodeSelete(array: IProduct): void {
    this.barcodeSelete = array;
  }

  setBarcodForPrint(array: IUid[]): void {
    this.uidGroupForPrint = array;
    this.dsUidGroupForPrint.next(this.uidGroupForPrint);
  }
  searchProduct(search: string): Observable<IProduct[]> {
    return this.apiBarcodeManager.searchProduct(search);
  }

  loadBarcodeUiList(pid: number): Observable<IUid[]> {
    return this.apiBarcodeManager.loadBarcodeUiList(pid);
  }

  addBarcode(model: MAddBarcode): Observable<number> {
    return this.apiBarcodeManager.addBarcode(model);
  }

  onDeleteSubmit(uidids: MDeleteUid): Observable<number> {
    return this.apiBarcodeManager.onDeleteSubmit(uidids);
  }
}
