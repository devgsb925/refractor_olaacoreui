import { NgModule, Component } from '@angular/core';
import { StockComponent } from './stock.component';
import { Routes, RouterModule } from '@angular/router';
import { StockinResolverService } from './resolver/stockin-resolver.service';

const routes: Routes = [
  {
    path: '',
    resolve: { stockinData: StockinResolverService },
    component: StockComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockinRoutingModule {}
