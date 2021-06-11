import { isNull } from '@angular/compiler/src/output/output_ast';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxPrinterService } from 'ngx-printer';
import { Subscription } from 'rxjs';
import { IVariants } from 'src/app/shared/interfaces/i-variants';
import { SortingPipe } from 'src/app/shared/pipe/sorting.pipe';
import { ToastService } from 'src/app/toast/toast-service';
import { IProduct } from './dto/interfaces/I-product';
import { IUid } from './dto/interfaces/i-uid';
import { MAddBarcode } from './dto/model/m-add-barcode';
import { BarcodeManagerService } from './view-model/barcode-manager.service';
import { MDeleteUid } from './dto/model/m-delete-uid'

@Component({
  selector: 'app-barcode-manager',
  templateUrl: './barcode-manager.component.html',
  styleUrls: ['./barcode-manager.component.scss'],
})
export class BarcodeManagerComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  selUid: string;
  barcodeFormat = 'CODE128';
  search: string;
  selOption = 0;
  productId: number;
  selectedRadioGroup: string;
  pos = 0;
  selectAll = false;
  chengeDisplay = false;
  searchUidKw = '';
  uidValue = '';

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

  constructor(
    public vmBarcodeManager: BarcodeManagerService,
    private toast: ToastService,
    private sorting: SortingPipe,
    public printerService: NgxPrinterService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {

    this.subscription?.unsubscribe();

    this.vmBarcodeManager.productList = [];
    this.vmBarcodeManager.uidList = [];
    this.vmBarcodeManager.uidGroupForPrint = [];
  }

  searchProductList(): void {
    if (this.search !== '') {

      this.vmBarcodeManager.searchProduct(this.search).subscribe((res) => {
        if (res.length > 0) {
          this.vmBarcodeManager.setProductList(res);
        }
      });

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

  generateBarcode(model: IProduct): void {
    this.vmBarcodeManager.setBarcodeSelete(model);
    this.loadBarcodeUiList(model.productId);
    this.productId = model.productId;
    this.selUid = '';
    this.selectAll = false;
  }

  loadBarcodeUiList(podid: number): void {
    this.toast.doToast();
    this.vmBarcodeManager.loadBarcodeUiList(podid).subscribe(
      (res) => {
        if (res !== undefined) {
          this.vmBarcodeManager.setUidList(
            this.sorting.transform(res, 'emeiId')
          );
          this.vmBarcodeManager.setMasterUidList(
            this.sorting.transform(res, 'emeiId')
          );


          if (this.vmBarcodeManager.uidList.length === 0) {
            this.selectedRadioGroup = 'NONE';
          } else {
            if (this.vmBarcodeManager.uidList[0].uidType === 1) {
              this.selectedRadioGroup = 'IMEI';
            } else if (this.vmBarcodeManager.uidList[0].uidType === 2) {
              this.selectedRadioGroup = 'S/N';
            } else if (this.vmBarcodeManager.uidList[0].uidType === 3) {
              this.selectedRadioGroup = 'MAC';
            } else if (this.vmBarcodeManager.uidList.length === 0) {
              this.selectedRadioGroup = 'NONE';
            } else {
              this.selectedRadioGroup = 'NONE';
            }
          }
        }
      },
      (err) => console.log(err),
      () => {
        this.toast.closeToast();
      }
    );
  }

  getItemsCount(): number {
    return this.vmBarcodeManager.uidList.length;
  }

  posEventEmmit($event: any): void {
    this.pos = $event;
  }

  barcodeList(): IUid[] {
    const copyItems: IUid[] = Object.assign([], this.vmBarcodeManager.uidList);

    if (copyItems.length > 28) {
      const newList = copyItems.splice(this.pos * 28, 28);
      return newList;
    } else {
      return copyItems;
    }
  }

  getDataFortable(start: number, end: number): IUid[] {
    return this.barcodeList().slice(start, end);
  }

  checkAllFunction(list: IUid[]): void {

    if(list.length >0){
      this.vmBarcodeManager.setBarcodForPrint(
        list.filter((f: IUid) => f.hasSel === true)
      );

      if (this.selectAll === true) {
        list.forEach((itx) => {
          itx.hasSel = true;
        });

        this.vmBarcodeManager.setBarcodForPrint(list);
        this.selUid = list[0].uidValue;
      } else {
        list.forEach((itx) => {
          itx.hasSel = false;
        });
        this.vmBarcodeManager.setBarcodForPrint([]);
        this.selUid = 'NONE';
      }
    }

  }

  onChangeProductHasSelect(list: IUid[], i: number): void {
    this.vmBarcodeManager.setBarcodForPrint(
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

  searchUid(){
    if(this.searchUidKw.length > 0){
    const newList = this.vmBarcodeManager.masterUidList.filter(
      f=> f.uidValue.toLowerCase().includes(this.searchUidKw.toLowerCase())
      )
    this.vmBarcodeManager.setUidList(newList);
    }else{
      this.vmBarcodeManager.setUidList(this.vmBarcodeManager.masterUidList);
    }
  }

  disableUidOption(utypeid: number, modelutypeid: number): boolean {
    if (utypeid === modelutypeid && modelutypeid !== 0) {
      return false;
    }
    if (this.vmBarcodeManager.masterUidList.length === 0) {
      return false;
    }
    return true;
  }

  getUidType(uidtype: number): number {
    const returnId = this.vmBarcodeManager.masterUidList.find(
      (f) => f.uidType === uidtype
    );
    if (returnId === undefined || null) {
      return 0;
    }
    return uidtype;
  }


  addSubmit(): void{
      const addBarcode :MAddBarcode ={
        productId: this.productId,
        uidValue: this.uidValue,
        uidType: this.uidRadioGroup.find(f => f.valueStr === this.selectedRadioGroup).uidTypeId,
      }

      if(addBarcode.uidType === 0){
        alert('please select uid type');
        return;
      }

      if(addBarcode.uidValue !== ''){
        this.toast.doToast();
         const addSub =  this.vmBarcodeManager.addBarcode(addBarcode).subscribe(res => {
                if(res > 0){
                  alert('add uid complete');
                  this.updateAfterAdd(addBarcode, res);
                  this.uidValue = '';
                }else if(res === 0){
                  alert('Please again');
                }else{
                  alert('The UIDValue has exist...!');
                }
            },(err)=> console.log(err),
            () => {
              // this.subscription.add(addSub);
              this.toast.closeToast();
            }
            )
      }else{
        alert(`Please push UID value`);
        this.toast.closeToast();
        return;
      }
  }

  updateAfterAdd(uid: MAddBarcode, id: number): void{
    let newList:  IUid[] = [
      {
        emeiId: id, // pk
        productId: uid.productId,
        uidValue: uid.uidValue,
        uidType: uid.uidType, // 1 = IMEI, 2 = S/N, 3 = MAC, 0 = NONE
        hasSel: false,
      }
    ];

    const cat = newList.concat(this.vmBarcodeManager.uidList);
    this.vmBarcodeManager.setUidList(cat);
    this.vmBarcodeManager.setMasterUidList(cat);
  }

  deleteSubmit(): void{
    let delBarcod =  this.vmBarcodeManager.uidList;

      if(delBarcod.filter(f => f.hasSel === true).length > 0){

        if (confirm("are your sur delete!")) {
          this.toast.doToast();
          let uids:MDeleteUid  = {
            imeiIds: delBarcod.filter(f => f.hasSel=== true).map(m => m.emeiId)
          }
          this.vmBarcodeManager.onDeleteSubmit(uids).subscribe((res)=>{
            if(res > 0){
              uids.imeiIds.forEach(itx => {
                  this.updateAfterDelete(itx)
              });
              this.toast.closeToast();
            }
          }),(err)=>console.log(err),
          () => {
            this.toast.closeToast();
          }

        }

      }else {
        alert('Please select uid');
      }
  }


  updateAfterDelete(id: number): void{
    const findItemDelete = this.vmBarcodeManager.uidList.find(f => f.emeiId === id);
    const deleteItem = this.vmBarcodeManager.uidList.indexOf(findItemDelete);
     this.vmBarcodeManager.uidList.splice(deleteItem, 1);

     const findItemDeleteM = this.vmBarcodeManager.masterUidList.find(f => f.emeiId === id);
     const deleteItemM = this.vmBarcodeManager.masterUidList.indexOf(findItemDeleteM);
      this.vmBarcodeManager.masterUidList.splice(deleteItemM, 1);

  }


}
