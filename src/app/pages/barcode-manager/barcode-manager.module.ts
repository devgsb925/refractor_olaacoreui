import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarcodeManagerComponent } from './barcode-manager.component';
import { BarcodeManagerApiService } from './api/barcode-manager-api.service';
import { BarcodeManagerRoutingModule } from './barcode-manager-routing.module';
import { NgxBarcodeModule } from 'ngx-barcode';
import { PaginationModule } from 'src/app/shared/components/pagination/pagination.module';
import { BarcodeManagerService } from './view-model/barcode-manager.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SortingModule } from 'src/app/shared/pipe/sorting.module';
import { SortingPipe } from 'src/app/shared/pipe/sorting.pipe';

@NgModule({
  declarations: [BarcodeManagerComponent],
  imports: [
    CommonModule,
    BarcodeManagerRoutingModule,
    NgxBarcodeModule,
    PaginationModule,
    FormsModule,
    ReactiveFormsModule,
    SortingModule,
  ],
  providers: [BarcodeManagerApiService, BarcodeManagerService, SortingPipe],
})
export class BarcodeManagerModule {}
