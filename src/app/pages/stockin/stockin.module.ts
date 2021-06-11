
import { StockinResolverService } from './resolver/stockin-resolver.service';
import { StockinService } from './api/stockin.service';
import { PendingShipmentViewModelService } from './view-model/pending-shipment-view-model.service';
import { PaginationModule } from './../../shared/components/pagination/pagination.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockComponent } from './stock.component';
import { RouterModule } from '@angular/router';
import { StockinRoutingModule } from './stockin-routing.module';
import { PendingShipmentComponent } from './components/pending-shipment/pending-shipment.component';
import { ReceivedShipmentComponent } from './components/received-shipment/received-shipment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReceivedShipmentModalComponent } from './components/received-shipment/received-shipment-modal/received-shipment-modal.component';
import { PendingShipmentModalComponent } from './components/pending-shipment/pending-shipment-modal/pending-shipment-modal.component';
import { BarcodeUidComponent } from './components/received-shipment/barcode-uid/barcode-uid.component';
import { NgxBarcodeModule } from 'ngx-barcode';
@NgModule({
  declarations: [
    StockComponent,
    PendingShipmentComponent,
    ReceivedShipmentComponent,
    ReceivedShipmentModalComponent,
    PendingShipmentModalComponent,
    BarcodeUidComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    StockinRoutingModule,
    PaginationModule,
    FormsModule,
    ReactiveFormsModule,
    NgxBarcodeModule,


  ],
  providers: [
    PendingShipmentViewModelService,
    StockinService,
    StockinResolverService,

  ],
})
export class StockinModule {}
