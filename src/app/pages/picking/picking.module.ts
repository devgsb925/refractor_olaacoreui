import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PickingComponent } from './picking.component';
import { PickingRoutingModule } from './picking-routing.module';
import { PickingViewModelService } from './picking-view-model.service';
import { PickingApiService } from './picking-api.service';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [PickingComponent],
  imports: [
    CommonModule,
    PickingRoutingModule,
    FormsModule
  ],
  providers: [
    PickingViewModelService,
    PickingApiService
  ]
})
export class PickingModule { }
