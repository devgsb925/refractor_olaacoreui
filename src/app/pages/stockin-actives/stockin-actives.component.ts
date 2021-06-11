import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IShipmentDetail } from './interfaces/i-shipment-detail';
import { IShipment } from './interfaces/i-shipment';
import { IOrderIncomplete } from './interfaces/i-order-incomplete';
import { StockinActivesViewModel } from './view-model/stockin-actives-view-model';
import { MUpdateShipDetail } from './model/m-update-recieved';
import { MSearchParam } from './model/m-search-param';

@Component({
  selector: 'app-stockin-actives',
  templateUrl: './stockin-actives.component.html',
  styleUrls: ['./stockin-actives.component.scss']
})
export class StockinActivesComponent implements OnInit, OnDestroy {


  shipmentDetailIdActive = 0;


  imeiValue = '';
  searchValue = '';
  remarkValue = '';
  searchOption = 0;

  showRemarkModal = false;
  showImeiModal = false;

  shipDetailPos = 0;

  private subscription: Subscription[] = [];

  constructor(
    public vmStockinnActives: StockinActivesViewModel,
  ) { }

  ngOnInit(): void {
    this.initShipment();
    this.initShipmentDetail();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }



  //#region Init
  private initShipment(): void {
    const shipmentSub = this.vmStockinnActives.readShipmentIncomplete().subscribe(res => {
      if (res.length > 0) {
        this.changeShipmentFunc(res[0].shipmentId);
        this.vmStockinnActives.setShipment(res);
        this.vmStockinnActives.setShipmentIds(res.map(r => r.shipmentId));
      }

    });
    this.subscription.push(shipmentSub);
  }

  private initShipmentDetail(): void {
    const shipmentDetailSub = this.vmStockinnActives.readShipmetnDetailByShipmentId().subscribe(res => {
      this.vmStockinnActives.setShipmentDetail(res);

    });
    this.subscription.push(shipmentDetailSub);
  }

  //#endregion

  onRecievedChange(sid: number, recieved: string): void {
    this.vmStockinnActives.updateRecieved(sid, parseInt(recieved, 10));
  }

  onRemarkChange(sid: number, remark: string): void {
    this.vmStockinnActives.updateRemark(sid, remark);
  }

  onBarcodeChange(pid: number, barcode: string): void {
    this.vmStockinnActives.updateBarcode(pid, barcode);
  }
  onImeiChange(): void {
    this.vmStockinnActives.addImei(this.imeiValue);
    this.imeiValue = '';
  }

  onSearchOptionChange(): void {
    this.searchValue = '';
  }

  setShipDetailPos(pos: number): void {
    this.shipDetailPos = pos;
  }

  getGetShipFunc(): IShipment[] {
    if (this.searchValue !== '') {
      switch (this.searchOption.toString()) {
        case '0':
          return this.vmStockinnActives.getShipById(parseInt(this.searchValue, 10));
        case '1':
          return this.vmStockinnActives.getShipByForwarderNo(this.searchValue);
        case '2':
          return this.vmStockinnActives.getShipByTrackingNo(this.searchValue);
      }
    } else {
      return this.vmStockinnActives.getShipment();
    }
  }



  showEmeiModalFunc(prodId: number, shipmentDetailId: number): void {
    this.vmStockinnActives.setProductId(prodId);
    this.vmStockinnActives.setShipmentDetailId(shipmentDetailId);
    this.showImeiModal = true;
  }


  showRemarkModalFunc(shipDetailId: number, remarkValue: string): void {
    this.vmStockinnActives.setShipmentDetailId(shipDetailId);
    this.remarkValue = remarkValue;
    this.showRemarkModal = true;
  }


  saveRemark(): void {
    this.vmStockinnActives.saveRemark(this.remarkValue);
    this.showRemarkModal = false;
  }
  saveFunc(): void {
    if (this.vmStockinnActives.getShipmentDetail().length > 0) {
      const uploadShipmentDetailSub = this.vmStockinnActives.uploadShipmentDetail().subscribe(res => {
        console.log(res);
        this.initShipment();
      });
      this.subscription.push(uploadShipmentDetailSub);
    }

    if (this.vmStockinnActives.getImei().length > 0) {
      const uploadImeiListSub = this.vmStockinnActives.uploadImeiList().subscribe(res => {
        console.log(res);
      });
      this.subscription.push(uploadImeiListSub);
    }

    if (this.vmStockinnActives.getBarcode().length > 0) {
      const uploadBarcodeSub = this.vmStockinnActives.uploadBarcode().subscribe(res => {
        console.log(res);
      });
      this.subscription.push(uploadBarcodeSub);
    }

  }

  getTableLength(): number[] {
    return new Array(Math.ceil(this.vmStockinnActives.getImei().length / 20));
  }

  changeShipmentFunc(shipId: number): void {
    this.vmStockinnActives.setShipmentId(shipId);
  }




}
