import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockDistributionComponent } from './stock-distribution.component';

const routes: Routes = [
  {
    path: '',
    component: StockDistributionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockDistributionRoutingModule { }
