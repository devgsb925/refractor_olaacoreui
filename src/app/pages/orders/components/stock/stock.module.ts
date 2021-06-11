import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockComponent } from './stock.component';
import { StockViewModelService } from './view-model/stock-view-model.service';
import { StockService } from './api/Stock.service';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'src/app/shared/components/pagination/pagination.module';

@NgModule({
  declarations: [StockComponent],
  imports: [CommonModule, FormsModule, PaginationModule],
  exports: [StockComponent],
  providers: [StockViewModelService, StockService],
})
export class StockModule {}
