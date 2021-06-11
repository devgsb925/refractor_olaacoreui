import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockInventoryComponent } from './stock-inventory.component';

const routes: Routes = [
  {
    path: '',
    component: StockInventoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockInventoryRoutingModule { }
