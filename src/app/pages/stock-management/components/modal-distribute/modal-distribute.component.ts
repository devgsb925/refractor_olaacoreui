import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StockManagementService } from '../../api/stock-management.service';
import { VmDistributeModalService } from '../../vm/vm-distribute-modal';
import { VmStockManagementService } from '../../vm/vm-stock-management.service';

import { MDistributeProduct } from '../../interfaces/m-distribute-product';
import { IStockManagementProducts } from '../../interfaces/i-stock-management-products';
import { IDistributeProduct } from '../../interfaces/i-distribute-product';

@Component({
  selector: 'app-modal-distribute',
  templateUrl: './modal-distribute.component.html',
  styleUrls: ['./modal-distribute.component.scss']
})
export class ModalDistributeComponent implements OnInit {

  @Output() UpdateListEvent = new EventEmitter<IDistributeProduct>();

  uidStr = '';
  constructor(
    public vmStockManagementService: VmStockManagementService,
    public vmDistributeModalService: VmDistributeModalService,
    private apiStockManagementService: StockManagementService
  ) { }

  ngOnInit(): void {
  }

  invStatus(prod: IStockManagementProducts): void {

    prod.edit = false;
    prod.invStockQty = prod.invDisplayQty + prod.invDemoQty + prod.invQcQty + prod.invWarehouseQty;

    prod.touch = true;

    if(prod.stockQty > prod.invStockQty){
      prod.stockFlag = 1;
    } else if(prod.stockQty < prod.invStockQty){
      prod.stockFlag = 2;
    } else {
      prod.stockFlag = 0;
    }

    if(prod.warehouseQty > prod.invWarehouseQty){

      prod.warehouseFlag = 1;

    } else if(prod.warehouseQty < prod.invWarehouseQty){
      prod.warehouseFlag = 2;
    } else {
      prod.warehouseFlag = 0;
    }

    if(prod.displayQty > prod.invDisplayQty){
      prod.displayFlag = 1;
    } else if(prod.displayQty < prod.invDisplayQty){
      prod.displayFlag = 2;
    } else {
      prod.displayFlag = 0;
    }

    if(prod.demoQty > prod.invDemoQty){
      prod.demoFlag = 1;
    } else if(prod.demoQty < prod.invDemoQty){
      prod.demoFlag = 2;
    } else {
      prod.demoFlag = 0;
    }

    if(prod.qcQty > prod.invQcQty){
      prod.qcFlag = 1;
    } else if(prod.qcQty < prod.invQcQty){
      prod.qcFlag = 2;
    } else {
      prod.qcFlag = 0;
    }

  }

  submitDistributeProd(): void {

    const p = this.vmDistributeModalService.selected_product;

    const model: MDistributeProduct = {
      pId: p.pId,
      movedBy: p.moveBy,
      requestBy: p.requestBy,
      moveFrom: p.moveFrom,
      moveQty: p.movedQty,
      moveTo: p.to,
      remarks: p.remarks,
      stockQty:p.stockQty,
      warehouseQty: p.unitInWarehouse,
      displayQty:p.unitInDisplay,
      demoQty:p.unitInDemo,
      qcQty: p.unitInQc,
      uidValues: p.uid.filter(s=>s.select === true).map(m=> m.uid)
    };

    this.apiStockManagementService.addDistributeProduct(model).subscribe(
      (res) => {
        if(res > 0) {
          const updateProd = this.vmStockManagementService.products.find(f=>f.pId === model.pId);

          if(updateProd.smId === 0){

            if(model.moveFrom == 'Warehouse') {
              updateProd.warehouseQty -= model.moveQty;
            } else if(model.moveFrom == 'Display') {
              updateProd.displayQty -= model.moveQty;
            } else if(model.moveFrom == 'Demo') {
              updateProd.demoQty -= model.moveQty;
            } else if(model.moveFrom == 'QC') {
              updateProd.qcQty -= model.moveQty;
            }

            if(model.moveTo == 'Warehouse') {
              updateProd.warehouseQty += model.moveQty;
            } else if(model.moveTo == 'Display') {
              updateProd.displayQty += model.moveQty;
            } else if(model.moveTo == 'Demo') {
              updateProd.demoQty += model.moveQty;
            } else if(model.moveTo == 'QC') {
              updateProd.qcQty += model.moveQty;
            }
            updateProd.qcFlag = 0;
            updateProd.demoFlag = 0;
            updateProd.warehouseFlag = 0;
            updateProd.displayFlag = 0;
            updateProd.stockFlag = 0;

            this.invStatus(updateProd);

          }


          this.closeModal();
        }
      }
    );

  }

  onClickChangeSelect(uidValue: string, area: string): void {
    const selUid = this.vmDistributeModalService.selected_product.uid.find(f=>f.uidValue === uidValue && f.distributionLocation === area && f.select === true);

    if(selUid !== undefined) {
      this.vmDistributeModalService.selected_product.movedQty += 1;
    } else {
      this.vmDistributeModalService.selected_product.movedQty -= 1;
      if(this.vmDistributeModalService.selected_product.movedQty < 0) {
        this.vmDistributeModalService.selected_product.movedQty = 0;
      }
      this.uidStr = '';
    }
  }

  enableSave(): boolean {
    const prod = this.vmDistributeModalService.selected_product;
    if(prod.movedQty > 0 && prod.moveFrom != '' && prod.to != '' && prod.requestBy != '' &&
    prod.moveBy != '') {
      return false;
    }

    return true;
  }

  hasUid(): boolean {
    if(this.vmDistributeModalService.selected_product.masterUidList.length > 0){
      return true;
    }
    return false;
  }


  scanUid(uid: string, moveFrom: string): void {

    const selUid = this.vmDistributeModalService.selected_product.uid.find(f=>f.uidValue === uid && f.distributionLocation === moveFrom);

    if(selUid !== undefined) {
      selUid.select = true;
      this.vmDistributeModalService.selected_product.movedQty += 1;
    } else {
      alert('invalid uid. scan again.');
      this.uidStr = '';
    }

  }

  onChangeMoveFrom(): void {

    this.vmDistributeModalService.selected_product.movedQty = 0;

    if(this.vmDistributeModalService.selected_product.moveFrom == 'Warehouse') {
      this.vmDistributeModalService.moveTo.forEach(f=>f.lock = false);
      this.vmDistributeModalService.moveTo.find(f=>f.name === 'Warehouse').lock = true;
      this.vmDistributeModalService.moveFrom.find(f=>f.name === 'Warehouse').select = true;

      this.vmDistributeModalService.selected_product.uid = JSON.parse(JSON.stringify(this.vmDistributeModalService.selected_product.masterUidList.filter(f=>f.distributionLocation === 'Warehouse')));

    } else if(this.vmDistributeModalService.selected_product.moveFrom == 'Display') {
      this.vmDistributeModalService.moveTo.forEach(f=>f.lock = false);
      this.vmDistributeModalService.moveTo.find(f=>f.name === 'Display').lock = true;
      this.vmDistributeModalService.moveFrom.find(f=>f.name === 'Display').select = true;

      this.vmDistributeModalService.selected_product.uid = JSON.parse(JSON.stringify(this.vmDistributeModalService.selected_product.masterUidList.filter(f=>f.distributionLocation === 'Display')));

    } else if(this.vmDistributeModalService.selected_product.moveFrom == 'Demo') {
      this.vmDistributeModalService.moveTo.forEach(f=>f.lock = false);
      this.vmDistributeModalService.moveTo.find(f=>f.name === 'Demo').lock = true;
      this.vmDistributeModalService.moveFrom.find(f=>f.name === 'Demo').select = true;

      this.vmDistributeModalService.selected_product.uid = JSON.parse(JSON.stringify(this.vmDistributeModalService.selected_product.masterUidList.filter(f=>f.distributionLocation === 'Demo')));

    } else if(this.vmDistributeModalService.selected_product.moveFrom == 'QC') {
      this.vmDistributeModalService.moveTo.forEach(f=>f.lock = false);
      this.vmDistributeModalService.moveTo.find(f=>f.name === 'QC').lock = true;
      this.vmDistributeModalService.moveFrom.find(f=>f.name === 'QC').select = true;

      this.vmDistributeModalService.selected_product.uid = JSON.parse(JSON.stringify(this.vmDistributeModalService.selected_product.masterUidList.filter(f=>f.distributionLocation === 'QC')));
    } else {

      this.vmDistributeModalService.moveTo.forEach(f=>f.lock = false);
      this.vmDistributeModalService.moveTo.find(f=>f.name === '--select--').lock = true;

      this.vmDistributeModalService.selected_product.uid = [];
    }
  }

  onMoveQty(): void {

    if(this.vmDistributeModalService.selected_product.unitInWarehouse < this.vmDistributeModalService.selected_product.movedQty
      && this.vmDistributeModalService.selected_product.moveFrom == 'Warehouse'){
      alert('invalid qty.');
      this.vmDistributeModalService.selected_product.movedQty = 1;
    }

    if(this.vmDistributeModalService.selected_product.unitInDisplay < this.vmDistributeModalService.selected_product.movedQty
      && this.vmDistributeModalService.selected_product.moveFrom == 'Display'){
      alert('invalid qty.');
      this.vmDistributeModalService.selected_product.movedQty = 1;
    }

    if(this.vmDistributeModalService.selected_product.unitInDemo < this.vmDistributeModalService.selected_product.movedQty
      && this.vmDistributeModalService.selected_product.moveFrom == 'Demo'){
      alert('invalid qty.');
      this.vmDistributeModalService.selected_product.movedQty = 1;
    }

    if(this.vmDistributeModalService.selected_product.unitInQc < this.vmDistributeModalService.selected_product.movedQty
      && this.vmDistributeModalService.selected_product.moveFrom == 'QC'){
      alert('invalid qty.');
      this.vmDistributeModalService.selected_product.movedQty = 1;
    }
  }

  closeModal(): void {

    this.UpdateListEvent.next(this.vmDistributeModalService.selected_product);
    this.vmDistributeModalService.products = [];
    this.vmDistributeModalService.selected_product.uid = [];
    this.vmDistributeModalService.selected_product.masterUidList = [];
    this.vmDistributeModalService.selected_product.pId = 0;
    this.vmStockManagementService.showDistributeModal = false;

  }

  enableMoveTo(): boolean {
    const prod = this.vmDistributeModalService.moveFrom.find(f=>f.select === true);
    if(prod === undefined) {
      return true;
    } else {
      return false;
    }
  }

  hasStock(name: string): boolean {

    if(name === 'Warehouse') {
      if(this.vmDistributeModalService.selected_product.stockQty > 0 &&
        this.vmDistributeModalService.selected_product.unitInWarehouse > 0) {
          return false;
        } else {
          return true;
        }
    } else if(name === 'Display') {
      if(this.vmDistributeModalService.selected_product.stockQty > 0 &&
        this.vmDistributeModalService.selected_product.unitInDisplay > 0) {
          return false;
        } else {
          return true;
        }
    } else if(name === 'Demo') {
      if(this.vmDistributeModalService.selected_product.stockQty > 0 &&
        this.vmDistributeModalService.selected_product.unitInDemo > 0) {
          return false;
        } else {
          return true;
        }
    } else if(name === 'QC') {
      if(this.vmDistributeModalService.selected_product.stockQty > 0 &&
        this.vmDistributeModalService.selected_product.unitInQc > 0) {
          return false;
        } else {
          return true;
        }
    }
  }

}
