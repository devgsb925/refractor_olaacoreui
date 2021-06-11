import { PaginationModule } from 'src/app/shared/components/pagination/pagination.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendingOrderComponent } from './pending-order.component';
import { PendingOrderService } from './view-model/pending-order.service';
import { FormsModule } from '@angular/forms';
import { PendingOrderListService } from './api/pending-order-list.service';

@NgModule({
  declarations: [PendingOrderComponent],
  imports: [CommonModule, FormsModule, PaginationModule],
  exports: [PendingOrderComponent],
  providers: [PendingOrderService, PendingOrderListService],
})
export class PendingOrderModule {}
