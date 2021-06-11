import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BarcodeManagerComponent } from './barcode-manager.component';

const routes: Routes = [
  {
    path: '',
    component: BarcodeManagerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BarcodeManagerRoutingModule {}
