import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SortingPipe } from 'src/app/shared/pipe/sorting.pipe';
import { ToastService } from 'src/app/toast/toast-service';
import { IInventoryHistory } from './components/inventory-history/interface/i-inventory-history';
import { StockinHistoryService } from './view-model/stockin-history.service';

@Component({
  selector: 'app-stock-inventory',
  templateUrl: './stock-inventory.component.html',
  styleUrls: ['./stock-inventory.component.scss']
})
export class StockInventoryComponent implements OnInit, OnDestroy {

  inventorySub = new Subscription();
  operatorId = 0;

  constructor(
    public vmInventory: StockinHistoryService,
    private toast: ToastService,
    private sorting: SortingPipe
    ) { }

  ngOnInit(): void {
    this.inventorySub = this.vmInventory.getInventoryList().subscribe(res => {
      if (res !== undefined) {
        this.vmInventory.setInventoryList(this.sorting.transform(res, 'inventoryDate'));
      }
    }, (err) => console.log(err),
      () => {

      }
    )
    this.getOperator();
  }

  ngOnDestroy(): void {
    this.inventorySub.unsubscribe();
  }

  getOperator(): void {
   this.inventorySub = this.inventorySub = this.vmInventory.getOperator().subscribe(res => {
      if(res !== undefined){
        this.vmInventory.setOperator(res);
      }
    }, (err) => console.log(err),
      () => {

      }
    )
  }

addInventoryHistory():void{
  if(this.operatorId > 0){
    const mode:{operatorId: number} = {
      operatorId: this.operatorId
    }
    this.toast.doToast();
    this.inventorySub = this.vmInventory.addInventoryHistory(mode).subscribe(res => {
      if(res !== undefined){
        alert('Addition completed');
        const newList:IInventoryHistory[] = [];
        newList.push(res);
        const catData = newList.concat(this.vmInventory.inventoryList)
        this.vmInventory.inventoryList = catData;
      }
    },(err)=> console.log(err),
    ()=>{
      this.toast.closeToast()
    }
    )
  }else{
    alert('Please select Operator');
  }

}

}
