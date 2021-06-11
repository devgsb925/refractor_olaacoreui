import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockInventoryRoutingModule } from './stock-inventory-routing.module';
import { StockInventoryComponent } from './stock-inventory.component';
import { RouterModule } from '@angular/router';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InventoryHistoryComponent } from './components/inventory-history/inventory-history.component';
import { StockinHistoryService } from './view-model/stockin-history.service';
import { StockinInventoryApiService } from './api/stockin-inventory-api.service';
import { EditStockinHistoryComponent } from './components/edit-stockin-history/edit-stockin-history.component';
import { PaginationModule } from 'src/app/shared/components/pagination/pagination.module';
import { SortingModule } from 'src/app/shared/pipe/sorting.module';

@NgModule({
  declarations: [StockInventoryComponent, InventoryHistoryComponent, EditStockinHistoryComponent],
  imports: [
    CommonModule,
    StockInventoryRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule,
    SortingModule
  ],
  exports: [
    InventoryHistoryComponent
  ],
  providers: [StockinHistoryService,StockinInventoryApiService]
})
export class StockInventoryModule { }
