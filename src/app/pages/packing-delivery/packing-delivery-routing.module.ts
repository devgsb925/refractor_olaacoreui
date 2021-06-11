import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PackingDeliveryComponent } from './packing-delivery.component';

const routes: Routes = [{
  path: '',
  component: PackingDeliveryComponent,
}]
@NgModule({

  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class PackingDeliveryRoutingModule { }
