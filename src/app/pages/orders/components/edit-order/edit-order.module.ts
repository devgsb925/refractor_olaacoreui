import { OrderViewModelService } from './../order/order-view-model.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditOrderComponent } from './edit-order.component';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from '../../../../shared/components/pagination/pagination.module';
import { NgjSelectModule } from '../../../../shared/components/ngj-select/ngj-select.module';
import { EditOrderViewModelService } from './edit-order-view-model.service';
import { PageOrdersService } from '../../api/page-orders.service';

@NgModule({
  declarations: [EditOrderComponent],
  imports: [CommonModule, FormsModule, PaginationModule, NgjSelectModule],
  exports: [EditOrderComponent],
  providers: [EditOrderViewModelService, PageOrdersService],
})
export class EditOrderModule {}
