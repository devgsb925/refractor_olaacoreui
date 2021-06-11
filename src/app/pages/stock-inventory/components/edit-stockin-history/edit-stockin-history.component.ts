import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/toast/toast-service';
import { StockinHistoryService } from '../../view-model/stockin-history.service';
import { IEditInventory } from './dto/interfaces/i-edit-inventory';
import { ISaveEdit } from './dto/model/i-save-edit';

@Component({
  selector: 'app-edit-stockin-history',
  templateUrl: './edit-stockin-history.component.html',
  styleUrls: ['./edit-stockin-history.component.scss']
})
export class EditStockinHistoryComponent implements OnInit {
  selRow = 0;
  jsonData:IEditInventory[] =[
    {
      stockInventoryLogId : 1,
      inventoryDate: new Date(),
      lastUpdate: new Date(),
      productId: 1,
      productDescription: 'test1',
      stockQty: 1,
      unitsOnWarehouse: 1,
      unitsOnDisplay: 1,
      unitsOnDemo: 1,
      unitsOnQC: 1,
      status: 1,
      hasUpdate: false,
    },
    {
      stockInventoryLogId : 2,
      inventoryDate: new Date(),
      lastUpdate: new Date(),
      productId: 2,
      productDescription: 'test2',
      stockQty: 2,
      unitsOnWarehouse: 2,
      unitsOnDisplay: 2,
      unitsOnDemo: 2,
      unitsOnQC: 2,
      status: 2,
      hasUpdate: false,
    },

    {
      stockInventoryLogId : 3,
      inventoryDate: new Date(),
      lastUpdate: new Date(),
      productId: 3,
      productDescription: 'test3',
      stockQty: 3,
      unitsOnWarehouse: 3,
      unitsOnDisplay: 3,
      unitsOnDemo: 3,
      unitsOnQC: 3,
      status: 3,
      hasUpdate: false,
    },
]

  constructor(
    public vmInventory: StockinHistoryService,
    private toast: ToastService
    ) { }

  ngOnInit(): void {
    // this.vmInventory.setEditInventory(this.jsonData);
  }

  saveSubmit(es:IEditInventory ): void{
    if(es.hasUpdate === true){

      this.toast.doToast();
      const saveModel :ISaveEdit ={
        stockInventoryLogId : es.stockInventoryLogId,
        unitsOnWarehouse: es.unitsOnWarehouse,
        unitsOnDisplay: es.unitsOnDisplay,
        unitsOnDemo: es.unitsOnDemo,
        unitsOnQC: es.unitsOnQC,
        status: es.status,
      }

      this.vmInventory.saveSubmit(saveModel).subscribe(res => {
        if(res > 0){
          alert('Edit inventory complete');
          this.vmInventory.editInventoryList.forEach(f => {
            f.hasUpdate = false;
          })

          this.vmInventory.setEditInventory(this.vmInventory.editInventoryList);
        }
      },(err)=> console.log(err),
      () => {
        this.toast.closeToast();

      }
      )
    }
  }

}
