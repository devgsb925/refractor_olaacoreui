import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockDistributionRoutingModule } from './stock-distribution-routing.module';
import { StockDistributionComponent } from './stock-distribution.component';

import { VmStockDistribution } from './vm/vm-stock-distribution.service';
import { TabStockDistributionComponent } from './components/tab-stock-distribution/tab-stock-distribution.component';
import { TabDistributionLogsComponent } from './components/tab-distribution-logs/tab-distribution-logs.component';
import { PaginationModule } from 'src/app/shared/components/pagination/pagination.module';
import { FormsModule } from '@angular/forms';
import { SelectCategoryModule } from '../store/products/select-category/select-category.module';
import { SelectBrandModule } from '../store/products/select-brand/select-brand.module';
import { ModalDistributeComponent } from './components/modal-distribute/modal-distribute.component';

@NgModule({
  declarations: [StockDistributionComponent, TabStockDistributionComponent, TabDistributionLogsComponent, ModalDistributeComponent],
  imports: [
    CommonModule,
    StockDistributionRoutingModule,
    PaginationModule,
    FormsModule,
    SelectCategoryModule,
    SelectBrandModule
  ],
  providers: [
    VmStockDistribution
  ]
})
export class StockDistributionModule { }
