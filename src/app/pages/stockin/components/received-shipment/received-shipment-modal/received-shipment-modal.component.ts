
import { MUpdateReceivedShipment } from './../dto/model/m-update-received-shipment';
import { IVariants } from './../../../../../shared/interfaces/i-variants';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PendingShipmentViewModelService } from '../../../view-model/pending-shipment-view-model.service';
import { IProductReceivedShipment } from '../dto/interface/i-product-received-shipment';
import { IReceivedShipment } from '../dto/interface/i-received-shipment';
import { Subscription } from 'rxjs';
import { ToastService } from 'src/app/toast/toast-service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-received-shipment-modal',
  templateUrl: './received-shipment-modal.component.html',
  styleUrls: ['./received-shipment-modal.component.scss'],
})
export class ReceivedShipmentModalComponent implements OnInit, OnDestroy {
  posProduct = 0;
  selTable = 0;
  select = false;
  subscription: Subscription[] = [];

  disNext = false;
  disBack = false;

  constructor(
    public vmPendingShipment: PendingShipmentViewModelService,
    private toast: ToastService,
  ) { }

  ngOnInit(): void { }

  datimeFunc(date: Date): string {
    const format = 'dd/M/yy';
    const myDate = date;
    const locale = 'en-US';
    const formattedDate = formatDate(myDate, format, locale);
    return formattedDate;
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  getItemsCount(): number {
    return this.vmPendingShipment.selectReceivedDetail.shipmentProducts.length;
  }

  posEventEmmit($event: any): void {
    this.posProduct = $event;
  }

  productList(): IProductReceivedShipment[] {
    const copyItems: IProductReceivedShipment[] = Object.assign(
      [],
      this.vmPendingShipment.selectReceivedDetail.shipmentProducts
    );

    if (copyItems.length > 20) {
      return copyItems.splice(this.posProduct * 20, 20);
    } else {
      return copyItems;
    }
  }

  chackToolTip(char: number, max: number): boolean {
    if (char > max) {
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

  checkHasupdate(podlist): boolean {
    if (podlist.find((f) => f.hasUpdate === true)) {
      return true;
    } else {
      return false;
    }
  }

  checkUidStatus(s: number): string {
    if (s === 0) {
      return '';
    }

    if (s === 1) {
      return 'IMEI';
    }

    if (s === 2) {
      return 'S/N';
    }

    if (s === 3) {
      return 'MAC';
    }
  }

  checkAllFunction(list: IProductReceivedShipment[]): void {
    if (this.select === true) {
      list.forEach((itx) => {
        itx.hasSelect = false;
      });
    } else {
      list.forEach((itx) => {
        itx.hasSelect = true;
      });
    }
  }

  onChangeProductHasSelect(list: IProductReceivedShipment[]): void {
    if (list.find((f) => f.hasSelect === false)) {
      this.select = false;
    } else if (
      list.length === list.filter((f) => f.hasSelect === true).length
    ) {
      this.select = true;
    }
  }

  addBarCodeSubmit(list: IProductReceivedShipment[]): void {
    const checkHasSel = list.filter((f) => f.hasSelect === true);

    if (checkHasSel.length > 0) {
      this.vmPendingShipment.setProductBarCode(checkHasSel);
      this.vmPendingShipment.barcode = true;
    } else {
      alert('Plzz Select Order');
    }
  }

  onCloseReceivedShipmentDetails(): void {
    this.vmPendingShipment.receivedShipmentModal = false;

    const resetMal: IReceivedShipment = {
      shipmentId: 0,
      recievedDate: new Date(),
      status: 0,
      forwarderNo: '',
      trackingNo: '',
      boxCount: 0,
      weight: 0,
      volume: 0,
      shipmentDtate: new Date(),
      hasUpdate: false,
      shipmentProducts: [],
    };

    this.vmPendingShipment.setSelectReceivedDetail(resetMal);
  }

  mappedPrePostUpdateReceivedShipment(shipmentdetail: IReceivedShipment): any {
    const productListMap = shipmentdetail.shipmentProducts
      // .filter((f) => f.hasUpdate === true)
      .map((m) => {
        return {
          receivedQty: m.receivedQty,
          remarks: m.remarks,
          shipmentDetailId: m.shipmentDetailId,
          orderId: m.orderId,
          orderStatus: this.getOrderStatus(m.orderId),
        };
      });

    const map1: MUpdateReceivedShipment = {
      shipmentId: shipmentdetail.shipmentId,
      _recievedShipments: productListMap,
    };

    return map1;
  }

  getOrderStatus(orderid: number): number {
    const orderItem = this.vmPendingShipment.selectReceivedDetail.shipmentProducts.filter(f => f.orderId == orderid);
    const newList: IProductReceivedShipment[] = [];

    orderItem.forEach(itx => {
      if (itx.receivedQty < itx.shippedQty) {
      }

      if (itx.receivedQty >= itx.shippedQty) {
        newList.push(itx)
      }
    });

    if (orderItem.length !== newList.length) {
      return 1
    } else {
      return 2
    }
  }

  onSubmitUpdateReceivedShipment(shipemnt: IReceivedShipment): void {
    this.toast.doToast();
    const updateSub = this.vmPendingShipment
      .onSubmitUpdateReceivedShipment(
        this.mappedPrePostUpdateReceivedShipment(shipemnt)
      )
      .subscribe(
        (res) => {
          if (res > 0) {
            alert('update successful')
            this.updateTableAfterEdit(shipemnt, res);
          }
        },
        (err) => console.log(err),
        () => {
          this.subscription.push(updateSub);
          this.vmPendingShipment.selectReceivedDetail.shipmentProducts.forEach(
            (f) => (f.hasUpdate = false)
          );
          this.selTable = 0;
          this.toast.closeToast();
        }
      );
  }

  updateTableAfterEdit(mode: IReceivedShipment, status: number): void {
    const findData = this.vmPendingShipment.receivedShipment.find(
      (f) => f.shipmentId === mode.shipmentId
    );
    const index = this.vmPendingShipment.receivedShipment.indexOf(findData);
    this.vmPendingShipment.receivedShipment.splice(index, 1);
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
    this.vmPendingShipment.receivedShipment.push(findData);
    this.vmPendingShipment.setReceivedShipment(this.sortingFunc(this.vmPendingShipment.receivedShipment, 'shipmentId'));
  }

  sortingFunc(array: any, field: string) {
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


  checkReceivedQty(shipmentDetailId: number) {
    const product = this.vmPendingShipment.selectReceivedDetail.shipmentProducts.find(f => f.shipmentDetailId === shipmentDetailId);
    if (product.receivedQty <= product.shippedQty) {
    } else {
      alert(`Can't add more max Received Qty is` + ' ' + product.shippedQty);
      product.receivedQty = 0;
    }
  }


  nextDetailFunc(reshipId: number, option: number): void {
    const allReShip = this.vmPendingShipment.receivedShipment;

    if (option === 1) {
      let index;
      index = allReShip.findIndex(f => f.shipmentId === reshipId);

      if (allReShip.length+1  > index) {
        index += 1;
        this.disBack = false;
        if(allReShip.length !== index){
          const detailSub = this.vmPendingShipment
          .getReceivedShipmentDetail(allReShip[index].shipmentId)
          .subscribe(
            (res) => {
              if (res !== undefined) {
                this.vmPendingShipment.setSelectReceivedDetail(res);
                this.vmPendingShipment.receivedShipmentModal = true;
              }
            },
            (err) => console.log(err),
            () => {
              this.subscription.push(detailSub);
            }
          );
        }else{
         this.disNext = true;
        }

      }

    }else{
      let index;
      index = allReShip.findIndex(f => f.shipmentId === reshipId);

      if(index + 1 > 1){
        index -= 1;
        this.disNext = false;
        const detailSub = this.vmPendingShipment
        .getReceivedShipmentDetail(allReShip[index].shipmentId)
        .subscribe(
          (res) => {
            if (res !== undefined) {
              this.vmPendingShipment.setSelectReceivedDetail(res);
              this.vmPendingShipment.receivedShipmentModal = true;
            }
          },
          (err) => console.log(err),
          () => {
            this.subscription.push(detailSub);
          }
        );
      }else{
        this.disBack = true;
      }


    }


  }


}
