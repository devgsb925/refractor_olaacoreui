import { SelectForwarderModule } from './../../shared/components/select-forwarder/select-forwarder.module';
import { SelectCourierModule } from './../../shared/components/select-courier/select-courier.module';
import { ShipmentRoutingModule } from './shipment-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShipmentComponent } from './shipment.component';
import { ShipmentApiService } from './api/shipment-api.service';
import { ShipmentViewModel } from './view-model/shipment-view-model.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShipmentDetailComponent } from './component/shipment-detail/shipment-detail.component';
import { NgjSelectModule } from 'src/app/shared/components/ngj-select/ngj-select.module';
import { VendorsComponent } from './component/vendors/vendors.component';
import { AddShipmentModalComponent } from './component/add-shipment-modal/add-shipment-modal.component';
import { AddShipmentDetailsComponent } from './component/add-shipment-details/add-shipment-details.component';
import { PaginationModule } from 'src/app/shared/components/pagination/pagination.module';
import { SortingModule } from 'src/app/shared/pipe/sorting.module';


@NgModule({
  declarations: [
    ShipmentComponent,
    ShipmentDetailComponent,
    VendorsComponent,
    AddShipmentModalComponent,
    AddShipmentDetailsComponent,
  ],
  imports: [
    CommonModule,
    ShipmentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgjSelectModule,
    PaginationModule,
    SelectCourierModule,
    SelectForwarderModule,
    SortingModule
  ],
  providers: [
    ShipmentApiService,
    ShipmentViewModel
  ],
})
export class ShipmentModule { }
