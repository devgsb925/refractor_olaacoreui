import { MAddBarcode } from './../dto/model/m-add-barcode';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { IVariants } from 'src/app/shared/interfaces/i-variants';
import { PendingShipmentViewModelService } from '../../../view-model/pending-shipment-view-model.service';
import { IProductBarcode } from '../dto/interface/i-product-barcode';
import { IUidGroup } from '../dto/interface/i-uid-group';
import { ToastService } from 'src/app/toast/toast-service';
import { NgxPrinterService } from 'ngx-printer';
import { IAddbarcodList } from '../dto/interface/i-addbarcod-list';

@Component({
  selector: 'app-barcode-uid',
  templateUrl: './barcode-uid.component.html',
  styleUrls: ['./barcode-uid.component.scss'],
})
export class BarcodeUidComponent implements OnInit {
  selUid: string;
  posBarcode = 0;
  subscription: Subscription[] = [];
  uidType: string;
  addBarcode: string;
  productId: number;
  selUidType: number;
  selectAll = false;
  selectBarcodeSize = 0;
  selectedRadioGroup = '';
  barcodeFormat = 'CODE128';
  print = false;
  selectIndex = 0;
  recievesQty = 0;
  chengeDisplay = false;
  uidRadioGroup = [
    {
      uidTypeId: 0,
      valueStr: 'NONE',
    },
    {
      uidTypeId: 1,
      valueStr: 'IMEI',
    },
    {
      uidTypeId: 2,
      valueStr: 'S/N',
    },
    {
      uidTypeId: 3,
      valueStr: 'MAC',
    },
  ];

  backupList : IUidGroup[] = [];

  constructor(
    public vmPendingShipment: PendingShipmentViewModelService,
    private toast: ToastService,
    public printerService: NgxPrinterService
  ) { }

  ngOnInit(): void { }

  getItemsCount(): number {
    return this.vmPendingShipment.modelBarcodeList.length;
  }

  posEventEmmit($event: any): void {
    this.posBarcode = $event;
  }

  barcodeList(): IUidGroup[] {
    const copyItems: IUidGroup[] = Object.assign(
      [],
      this.vmPendingShipment.modelBarcodeList
    );

    if (copyItems.length > 44) {
      return copyItems.splice(this.posBarcode * 44, 44);
    } else {
      return copyItems;
    }
  }

  getVariant(variants: IVariants[], varianttype: number): string {
    return variants.find((f) => f.refVariantId === varianttype) !== undefined
      ? variants.find((f) => f.refVariantId === varianttype).variantValue
      : '-';
  }

  chackToolTip(char: number, max: number): boolean {
    if (char > max) {
      return true;
    } else {
      return false;
    }
  }

  generateBarcode(model: IProductBarcode, i: number): void {
    this.vmPendingShipment.setBarcodeSelete(model);
    this.loadBarcodeUiList(model.productId);
    this.productId = model.productId;
    this.selUid = '';
    this.selectIndex = i;
    this.vmPendingShipment.modelBarcodeList.forEach((itx) => {
      itx.hasSel = false;
    });
    this.selectAll = false;
    this.recievesQty = model.receivedQty;
    if(this.vmPendingShipment.modelBarcodeList.length > 0){
      this.uploadBackup();
    }else{
      this.restoreBackup(model.productId);
    }


  }

  getUidGroup(start: number, end: number): IUidGroup[] {
    return this.barcodeList()
      .filter((f) => f.productId === this.productId)
      .slice(start, end);
  }

  closeBarCodeUIDModal(): void {
    this.vmPendingShipment.barcode = false;
    this.vmPendingShipment.setProductBarCode([]);
    this.vmPendingShipment.masterUidGroup = [];
    this.selUid = '';
    this.vmPendingShipment.modelBarcodeList = [];
  }

  loadBarcodeUiList(podid: number): void {
    this.toast.doToast();
    const barcodeSub = this.vmPendingShipment
      .loadBarcodeUiList(podid)
      .subscribe(
        (res) => {
          this.vmPendingShipment.setMasterUidGroup(res);
          this.checkUid();

          if (this.vmPendingShipment.masterUidGroup.length > 0) {
            this.vmPendingShipment.setBarcodeForPrint(res);
            if (this.vmPendingShipment.masterUidGroup[0].uidType === 1) {
              this.selectedRadioGroup = 'IMEI';
            } else if (this.vmPendingShipment.masterUidGroup[0].uidType === 2) {
              this.selectedRadioGroup = 'S/N';
            } else if (this.vmPendingShipment.masterUidGroup[0].uidType === 3) {
              this.selectedRadioGroup = 'MAC';
            }
          } else {
          }
        },
        (err) => console.log(err),
        () => {
          this.subscription.push(barcodeSub);
          this.toast.closeToast();
        }
      );
  }

  checkUid(): void {
    if (this.vmPendingShipment.masterUidGroup.length - 1 <= 0) {
      this.selectedRadioGroup = 'NONE';
    }
  }

  getUidType(uidtype: number): number {
    const returnId = this.vmPendingShipment.masterUidGroup.find(
      (f) => f.uidType === uidtype
    );
    if (returnId === undefined || null) {
      return 0;
    }
    return uidtype;
  }

  disableUidOption(utypeid: number, modelutypeid: number): boolean {
    if (utypeid === modelutypeid && modelutypeid !== 0) {
      return false;
    }
    if (this.vmPendingShipment.masterUidGroup.length === 0) {
      return false;
    }
    return true;
  }

  onAddUid(): void {
    this.toast.doToast();
    this.selectedRadioGroup === 'NONE' ? (this.selUidType = 0) : '';
    this.selectedRadioGroup === 'IMEI' ? (this.selUidType = 1) : '';
    this.selectedRadioGroup === 'S/N' ? (this.selUidType = 2) : '';
    this.selectedRadioGroup === 'MAC' ? (this.selUidType = 3) : '';
    const model: MAddBarcode = {
      productId: this.productId,
      uidValue: this.addBarcode,
      uidType: this.selUidType, // 1 = IMEI, 2 = S/N, 3 = MAC, 0 = NONE
    };

    if (model.uidType !== 0 && model.uidValue !== '') {
      const addUidSub = this.vmPendingShipment.addBarcode(model).subscribe(
        (res) => {
          if (res > 0) {
            this.updateUidAfterAdd(res, this.selUidType);
            this.selUid = model.uidValue;
          } else {
            alert('The UIDValue has exist...!');
          }
        },
        (err) => console.log(err),
        () => {
          this.subscription.push(addUidSub);
          this.toast.closeToast();
        }
      );
    } else {
      model.uidValue === '' ? alert('Barcode Data Empty') : '';
      model.uidType === 0 ? alert('Choose UID Type') : '';
      this.toast.closeToast();
    }
  }

  uploadBackup():void{
    this.vmPendingShipment.modelBarcodeList.forEach( f => {
      this.backupList.push(f);
    })
    this.vmPendingShipment.modelBarcodeList = [];
  }

  restoreBackup(id: number):void{
      const newList :IUidGroup[] = [];
      this.backupList.filter(f => f.productId === id).forEach(f =>{
        if(newList.length < this.recievesQty){
          newList.push(f);
        }
      })
      this.vmPendingShipment.modelBarcodeList = newList;

  }

  submitAddbarcod(): void {
    this.selectedRadioGroup === 'NONE' ? (this.selUidType = 0) : '';
    this.selectedRadioGroup === 'IMEI' ? (this.selUidType = 1) : '';
    this.selectedRadioGroup === 'S/N' ? (this.selUidType = 2) : '';
    this.selectedRadioGroup === 'MAC' ? (this.selUidType = 3) : '';
    const model: MAddBarcode = {
      productId: this.productId,
      uidValue: this.addBarcode,
      uidType: this.selUidType, // 1 = IMEI, 2 = S/N, 3 = MAC, 0 = NONE
    };

    if(model.uidType === 0){
      alert('please select select uid type');
      return;
    }

    if(model.uidValue === '' || model.uidValue === undefined){
      alert(`please push uid`);
      return;
    }

    if (
      this.vmPendingShipment.masterUidGroup.find(
        (f) => f.uidValue === this.addBarcode
      )
    ) {
      alert('Exist');
      return;
    } else if (
      this.vmPendingShipment.modelBarcodeList.find(
        (f) => f.uidValue === this.addBarcode
      )
    ) {
      alert('Exist');
      return;
    } else {

      if(this.vmPendingShipment.modelBarcodeList.length < this.recievesQty){
          this.vmPendingShipment.pushBarcodList(model);
          this.addBarcode = '';
      }else{
        alert(`Can't Add More Max Is ${this.recievesQty}`);
        return;
      }

    }
  }

  submitSave(): void {
    this.toast.doToast();
    const addModel: IAddbarcodList = {
      uIDList: this.vmPendingShipment.modelBarcodeList.filter(
        (f) => f.hasSel === true
      ),
    };

    if (addModel.uIDList.length > 0) {
      const barcodeList = this.vmPendingShipment
        .saveBarcodeList(addModel)
        .subscribe(
          (res) => {
            if (res > 0) {
              alert('Complete');
              this.loadBarcodeUiList(this.productId);
            } else {
              alert('Exist');
            }
          },
          (err) => console.log(err),
          () => {
            this.subscription.push(barcodeList);
            this.toast.closeToast();
          }
        );
    } else {
      alert('Data Emty Plz Select Uid');
      this.toast.closeToast();
    }
  }

  updateUidAfterAdd(uidid: number, seltype: number): void {
    const addNew: IUidGroup = {
      emeiId: uidid,
      productId: this.productId,
      uidValue: this.addBarcode,
      uidType: seltype,
      hasSel: false,
    };
    this.vmPendingShipment.masterUidGroup.push(addNew);
    this.vmPendingShipment.setMasterUidGroup(
      this.vmPendingShipment.masterUidGroup
    );

    this.vmPendingShipment.setBarcodeForPrint(
      this.vmPendingShipment.masterUidGroup
    );
    this.addBarcode = '';
  }

  onDeleteSubmit(uidList: IUidGroup[]): void {
    if (uidList.find((f) => f.hasSel === true)) {
      if (confirm('Are you sure to delete ')) {
        this.vmPendingShipment.modelBarcodeList = this.vmPendingShipment.modelBarcodeList.filter(
          (f) => f.hasSel === false
        );

        this.vmPendingShipment.modelBarcodeList.length
          ? ''
          : (this.selectAll = false);
      }
    }
  }

  checkAllFunction(list: IUidGroup[]): void {

    if(list.length > 0){
      this.vmPendingShipment.setBarcodeForPrint(
        list.filter((f: IUidGroup) => f.hasSel === true)
      );

      if (this.selectAll === true) {
        list.forEach((itx) => {
          itx.hasSel = true;
        });

        this.vmPendingShipment.setBarcodeForPrint(
          list.filter((f) => f.productId === this.productId && f.hasSel === true)
        );
        this.selUid = list[0].uidValue;
      } else {
        list.forEach((itx) => {
          itx.hasSel = false;
        });
        this.vmPendingShipment.setBarcodeForPrint([]);
        this.selUid = 'NONE';
      }
    }

  }

  onChangeProductHasSelect(list: IUidGroup[], i: number): void {
    this.vmPendingShipment.setBarcodeForPrint(
      list.filter((f) => f.hasSel === true)
    );
    if (list.find((f) => f.hasSel === false)) {
      this.selectAll = false;
      this.selUid = '';
      if (this.selUid === '') {
        this.selUid = list.find((f) => f.hasSel === true).uidValue;
      }
    } else if (list.length === list.filter((f) => f.hasSel === true).length) {
      this.selectAll = true;
      this.selUid = list[i].uidValue;
    }
  }
}
