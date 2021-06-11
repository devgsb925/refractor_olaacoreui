import { Subscription } from 'rxjs';
import { MUpdatePendingShipmentDetail } from './../dto/model/m-update-pending-shipment-detail';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IVariants } from 'src/app/shared/interfaces/i-variants';
import { PendingShipmentViewModelService } from '../../../view-model/pending-shipment-view-model.service';
import { IShipmentDetail } from '../dto/interfaces/i-shipment-detail';
import { IShipmentProduct } from '../dto/interfaces/i-shipment-product';
import { ToastService } from 'src/app/toast/toast-service';
import { IReceivedShipmentTable } from '../../../dto/interfaces/i-received-shipment-table';
import { IProductReceivedShipment } from '../../received-shipment/dto/interface/i-product-received-shipment';
import { formatDate } from '@angular/common';
import { MUpdateReceivedShipment } from '../../received-shipment/dto/model/m-update-received-shipment';
import { IReceivedShipment } from '../../received-shipment/dto/interface/i-received-shipment';

@Component({
  selector: 'app-pending-shipment-modal',
  templateUrl: './pending-shipment-modal.component.html',
  styleUrls: ['./pending-shipment-modal.component.scss'],
})
export class PendingShipmentModalComponent implements OnInit, OnDestroy {
  podProduct = 0;
  selTr = 0;
  subscription: Subscription[] = [];
  activeTr = 0;

  constructor(
    public vmPShipment: PendingShipmentViewModelService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {}

  datimeFunc(): string {
    const format = 'd/M/yy';
    const myDate = new Date();
    const locale = 'en-US';
    const formattedDate = formatDate(myDate, format, locale);
    return formattedDate;
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  getItemsCount(): number {
    return this.vmPShipment.selectedPendingShipment.shipmentProducts.length;
  }

  posEventEmmit($event: any): void {
    this.podProduct = $event;
  }

  productList(): IShipmentProduct[] {
    const copyItems: IShipmentProduct[] = Object.assign(
      [],
      this.vmPShipment.selectedPendingShipment.shipmentProducts
    );

    if (copyItems.length > 20) {
      const newList = copyItems.splice(this.podProduct * 20, 20);
      return newList;
    } else {
      return copyItems;
    }
  }

  checkReceivedQty(shipmentDetailId: number){
   const product = this.vmPShipment.selectedPendingShipment.shipmentProducts.find(f => f.shipmentDetailId === shipmentDetailId);
    if(product.receivedQty <= product.shippedQty){
    } else{
      alert(`Can't add more max Received Qty is`+' '+product.shippedQty);
      product.receivedQty = 0;
    }
  }

  chackToolTip(char: number, max: number): boolean {
    if (char > max) {
      return true;
    } else {
      return false;
    }
  }

  checkHasupdate(podlist: IShipmentProduct[]): boolean {
    if (podlist.find((f) => f.hasUpdate === true)) {
      return true;
    } else {
      return false;
    }
  }

  getVariant(variants: IVariants[], varianttype: number): string {
    return variants.find((f) => f.refVariantId === varianttype) !== undefined
      ? variants.find((f) => f.refVariantId === varianttype).variantValue
      : '-';
  }

  mappedPrePostUpdatePendingShipment(shipmentdetail: IShipmentDetail): any {
    const productListMap = shipmentdetail.shipmentProducts
      .filter((f) => f.hasUpdate === true)
      .map((m) => {
        return {
          receivedQty: m.receivedQty,
          remarks: m.remarks,
          shipmentDetailId: m.shipmentDetailId,
          orderId: m.orderId,
          orderStatus: this.getOrderStatus(m.orderId),

        };
      });

    const map1: MUpdatePendingShipmentDetail = {
      shipmentId: shipmentdetail.shipmentId,
      receivedDate: shipmentdetail.recievedDate,
      _pendingShipments: productListMap,
    };

    return map1;
  }

  getOrderStatus(orderid: number): number{
    const orderItem =  this.vmPShipment.selectedPendingShipment.shipmentProducts.filter(f => f.orderId == orderid);

    const newList : IShipmentProduct[] =[];

    orderItem.forEach(itx => {
        if(itx.receivedQty < itx.shippedQty){
        }

        if(itx.receivedQty >= itx.shippedQty){

          newList.push(itx)
        }
    });

    if(orderItem.length !== newList.length){
      return 1
    }else{
      return 2
    }
  }

  saveSubmit(shipmentdetail: IShipmentDetail): void {


    shipmentdetail.recievedDate = new Date();
    this.toast.doToast();
      const saveSub = this.vmPShipment
        .updatePendingShipmentDetail(
          this.mappedPrePostUpdatePendingShipment(shipmentdetail)
        )
        .subscribe(
          (res) => {
            if (res > 0) {

              var status:number;

              if(this.mappedPrePostUpdatePendingShipment(shipmentdetail)._pendingShipments.find(f => f.orderStatus !== 1)){
                status = 2;
              }else{
                status = 1;
              }

              this.closePendingShipmentDetail();
              this.updateTableAfterEdit(shipmentdetail, status);
            }
          },
          (err) => console.log(err),
          () => {
            this.subscription.push(saveSub);
            this.selTr = 0;

            this.toast.closeToast();
          }
        );
  }

  updateTableAfterEdit(model: IShipmentDetail, status: number): void {
    const updatTable = this.vmPShipment.pendingShipmentList.filter(
      (f) => f.shipmentId !== model.shipmentId
    );
    this.vmPShipment.setPendingShipment(updatTable);

    const updateTableReShipment: IReceivedShipmentTable = {
      shipmentId: model.shipmentId,
      forwarderNo: model.forwarderNo,
      trackingNo: model.trackingNo,
      boxCount: model.boxCount,
      weight: model.weight,
      volume: model.volume,
      shipmentDate: model.shipmentDtate,
      recievedDate: model.recievedDate,
      hasUpdate: false,
      shipmentStatus: status,
    };

    const updateNewReship: IReceivedShipmentTable[] = [];
    updateNewReship.push(updateTableReShipment);
    const concatArray = updateNewReship.concat(
      this.vmPShipment.receivedShipment
    );

    this.vmPShipment.setReceivedShipment(concatArray);

    this.vmPShipment.getReceivedShipmentDetail(model.shipmentId).subscribe(res => {
      this.vmPShipment.setSelectReceivedDetail(res);
      this.onSubmitUpdateReceivedShipment(res);
    })
  }

  closePendingShipmentDetail(): void {
    let resetModel: IShipmentDetail;
    this.vmPShipment.shipmentDetailModal = false;
    this.vmPShipment.selectedPendingShipment = resetModel;
  }

  //#region update received

  mappedPrePostUpdateReceivedShipment(shipmentdetail: IReceivedShipment): any {
    const productListMap = shipmentdetail.shipmentProducts
      // .filter((f) => f.hasUpdate === true)
      .map((m) => {
        return {
          receivedQty: m.receivedQty,
          remarks: m.remarks,
          shipmentDetailId: m.shipmentDetailId,
          orderId: m.orderId,
          orderStatus: this.getOrderStatusRe(m.orderId),
        };
      });

    const map1: MUpdateReceivedShipment = {
      shipmentId: shipmentdetail.shipmentId,
      _recievedShipments: productListMap,
    };

    return map1;
  }

  getOrderStatusRe(orderid: number): number{
    const orderItem =  this.vmPShipment.selectReceivedDetail.shipmentProducts.filter(f => f.orderId == orderid);
    const newList : IProductReceivedShipment[] =[];

    orderItem.forEach(itx => {
        if(itx.receivedQty < itx.shippedQty){
        }

        if(itx.receivedQty >= itx.shippedQty){
          newList.push(itx)
        }
    });

    if(orderItem.length !== newList.length){
      return 1
    }else{
      return 2
    }
  }

  onSubmitUpdateReceivedShipment(shipemnt: IReceivedShipment): void {
    this.toast.doToast();
    const updateSub = this.vmPShipment
      .onSubmitUpdateReceivedShipment(
        this.mappedPrePostUpdateReceivedShipment(shipemnt)
      )
      .subscribe(
        (res) => {
          if (res > 0) {
            alert('update successful')

            this.updateTableAfterEditRe(shipemnt, res);
          }
        },
        (err) => console.log(err),
        () => {
          this.subscription.push(updateSub);
          this.vmPShipment.selectReceivedDetail.shipmentProducts.forEach(
            (f) => (f.hasUpdate = false)
          );

          this.toast.closeToast();
        }
      );
  }

  updateTableAfterEditRe(mode: IReceivedShipment, status: number): void {
    const findData = this.vmPShipment.receivedShipment.find(
      (f) => f.shipmentId === mode.shipmentId
    );
    const index = this.vmPShipment.receivedShipment.indexOf(findData);
    this.vmPShipment.receivedShipment.splice(index, 1);

    findData.recievedDate = mode.recievedDate;
    findData.shipmentId = mode.shipmentId;
    findData.boxCount = mode.boxCount;
    findData.forwarderNo = mode.forwarderNo;
    findData.hasUpdate = false;
    findData.shipmentDate = mode.shipmentDtate;
    findData.shipmentStatus = status;
    findData.trackingNo = mode.trackingNo;
    findData.volume = mode.volume;
    findData.weight = mode.weight;
    this.vmPShipment.receivedShipment.push(findData);
    this.vmPShipment.setReceivedShipment( this.sortingFunc(this.vmPShipment.receivedShipment, 'shipmentId'));
  }

  sortingFunc(array: any, field: string){
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
  activeTrFun(id:number): void{
    this.selTr = id;
    this.activeTr = id;
  }

  //#endregion

}
