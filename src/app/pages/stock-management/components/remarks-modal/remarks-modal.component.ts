import { Component, OnInit } from '@angular/core';
import { StockManagementService } from '../../api/stock-management.service';
import { IStockManagementProducts } from '../../interfaces/i-stock-management-products';
import { VmStockManagementService } from '../../vm/vm-stock-management.service';

@Component({
  selector: 'app-remarks-modal',
  templateUrl: './remarks-modal.component.html',
  styleUrls: ['./remarks-modal.component.scss']
})
export class RemarksModalComponent implements OnInit {

  constructor(
    public vmStockManagementService: VmStockManagementService,
    private api: StockManagementService
  ) { }

  ngOnInit(): void {
  }

  submitRemarks(): void {

    this.vmStockManagementService.selected_stockmgt.check = 1;
    this.statusChecker();

    this.vmStockManagementService.selected_stockmgt.date = new Date();
    this.vmStockManagementService.selected_stockmgt.operatorCheck = '';
    this.vmStockManagementService.selected_stockmgt.touch = false;
    this.vmStockManagementService.selected_stockmgt.edit= false;

    const dlist: IStockManagementProducts[] = [];

    dlist.push(this.vmStockManagementService.selected_stockmgt);

    this.api.addOrUpdateStockManagement(dlist, 1).subscribe(
      (res) => {

        if(res.smId !== undefined) {
          this.vmStockManagementService.selected_stockmgt.smId = res.smId;
          this.vmStockManagementService.selected_stockmgt.check = 1;
          this.vmStockManagementService.selected_stockmgt.operatorCheck = res.operatorName;
          this.vmStockManagementService.selected_stockmgt.qcFlag = 0;
          this.vmStockManagementService.selected_stockmgt.demoFlag = 0;
          this.vmStockManagementService.selected_stockmgt.stockFlag = 0;
          this.vmStockManagementService.selected_stockmgt.displayFlag = 0;
          this.vmStockManagementService.selected_stockmgt.warehouseFlag = 0;

          this.vmStockManagementService.selected_stockmgt.invDemoQty = 0;
          this.vmStockManagementService.selected_stockmgt.invDisplayQty = 0;
          this.vmStockManagementService.selected_stockmgt.invQcQty = 0;
          this.vmStockManagementService.selected_stockmgt.invStockQty = 0;
          this.vmStockManagementService.selected_stockmgt.invWarehouseQty = 0;
        }

      },
      (err) => {
        console.log(err);

      }, () => {

        const updateProd = this.vmStockManagementService.products.find(f=>f.pId === this.vmStockManagementService.selected_stockmgt.pId);

        updateProd.smId = this.vmStockManagementService.selected_stockmgt.smId;
        updateProd.check = this.vmStockManagementService.selected_stockmgt.check;
        updateProd.status = this.vmStockManagementService.selected_stockmgt.status;
        updateProd.touch = false;

        updateProd.date = this.vmStockManagementService.selected_stockmgt.date;
        updateProd.operatorCheck = this.vmStockManagementService.selected_stockmgt.operatorCheck;

        this.vmStockManagementService.showRemarksModal = false;
      }
    );

  }

  statusChecker(): void {
    if(this.vmStockManagementService.selected_stockmgt.stockQty !== this.vmStockManagementService.selected_stockmgt.invStockQty){
      this.vmStockManagementService.selected_stockmgt.status = 2;
      return;
    }

    if(this.vmStockManagementService.selected_stockmgt.warehouseQty !== this.vmStockManagementService.selected_stockmgt.invWarehouseQty){
      this.vmStockManagementService.selected_stockmgt.status = 2;
      return;
    }

    if(this.vmStockManagementService.selected_stockmgt.displayQty !== this.vmStockManagementService.selected_stockmgt.invDisplayQty){
      this.vmStockManagementService.selected_stockmgt.status = 2;
      return;
    }

    if(this.vmStockManagementService.selected_stockmgt.demoQty !== this.vmStockManagementService.selected_stockmgt.invDemoQty){
      this.vmStockManagementService.selected_stockmgt.status = 2;
      return;
    }

    if(this.vmStockManagementService.selected_stockmgt.qcQty !== this.vmStockManagementService.selected_stockmgt.invQcQty){
      this.vmStockManagementService.selected_stockmgt.status = 2;
      return;
    }

    this.vmStockManagementService.selected_stockmgt.status = 1;
  }

}
