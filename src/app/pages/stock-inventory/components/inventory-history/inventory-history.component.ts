import { Component, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastService } from 'src/app/toast/toast-service';
import { StockinHistoryService } from '../../view-model/stockin-history.service';
import { IInventoryHistory } from './interface/i-inventory-history';

@Component({
  selector: 'app-inventory-history',
  templateUrl: './inventory-history.component.html',
  styleUrls: ['./inventory-history.component.scss']
})
export class InventoryHistoryComponent implements OnInit {

  constructor(
    public vmInventory :StockinHistoryService,
    private toast: ToastService,
    ) { }
  inventorySub = new Subscription();
  pos = 0;

  ngOnInit(): void {
  }

  getCountItem(): number{
   return this.vmInventory.inventoryList.length;
  }

  getPagePosition($event): void {
    this.pos = $event;
  }

  getInv(): IInventoryHistory[] {
    let inv: IInventoryHistory[] = [];
      const copyItems = Object.assign([], this.vmInventory.inventoryList);
      if (copyItems.length > 20) {
        inv = copyItems.splice(this.pos * 20, 20);
      } else {
        inv = copyItems;
      }
    return inv
  }

  getStatus(sid: number): string{
    if(sid === 0){
      return 'Pending';
    }

    if(sid === 1){
      return 'Incomplete';
    }

    if(sid === 2){
      return 'Complete'
    }
  }

  getOperatorIdByname(name: string): number{
   return this.vmInventory.operator.find(f => f.name === name).id;
  }

  editInventory(inv: IInventoryHistory):void{
    if(inv !== null){
      this.toast.doToast();
      const model:{inventoryDate: Date; OperatorId: number} = {
        inventoryDate: inv.inventoryDate,
        OperatorId: this.getOperatorIdByname(inv.operatorName),
      }
      this.vmInventory.getEditInventory(model).subscribe(res=> {
        if(res !== undefined){
           this.vmInventory.editPage = true;
           this.vmInventory.setEditInventory(res);
        }
      },(err) => console.log(err),
      () => {
          this.toast.closeToast();
      }
      )
    }

  }


}
