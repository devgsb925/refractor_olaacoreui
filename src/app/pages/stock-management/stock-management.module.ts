import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockManagementRoutingModule } from './stock-management-routing.module';
import { StockManagementComponent } from './stock-management.component';
import { StockManagementTabComponent } from './components/stock-management-tab/stock-management-tab.component';
import { DistributionLogsComponent } from './components/distribution-logs/distribution-logs.component';
import { InventoryLogsComponent } from './components/inventory-logs/inventory-logs.component';

import { VmDistributeModalService } from './vm/vm-distribute-modal';
import { VmStockManagementService } from './vm/vm-stock-management.service';
import { StockManagementService } from './api/stock-management.service';
import { SelectBrandModule } from '../store/products/select-brand/select-brand.module';
import { SelectCategoryModule } from '../store/products/select-category/select-category.module';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'src/app/shared/components/pagination/pagination.module';
import { RemarksModalComponent } from './components/remarks-modal/remarks-modal.component';
import { ModalDistributeComponent } from './components/modal-distribute/modal-distribute.component';

@NgModule({
  declarations: [StockManagementComponent, StockManagementTabComponent,
    DistributionLogsComponent, InventoryLogsComponent, RemarksModalComponent,
    ModalDistributeComponent],
  imports: [
    CommonModule,
    StockManagementRoutingModule,
    SelectCategoryModule,
    SelectBrandModule,
    FormsModule,
    PaginationModule
  ],
  providers: [
    VmDistributeModalService,
    VmStockManagementService,
    StockManagementService
  ],
  exports: [
    RemarksModalComponent
  ]
})
export class StockManagementModule { }
