import { PaginationModule } from 'src/app/shared/components/pagination/pagination.module';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OrderComponent } from './order.component';
import { FormsModule } from '@angular/forms';
import { PageOrdersService } from '../../api/page-orders.service';

@NgModule({
  declarations: [OrderComponent],
  imports: [
    CommonModule,
    FormsModule,
    PaginationModule
  ],
  exports: [
    OrderComponent
  ],
  providers: [
    PageOrdersService,
    DatePipe
  ]
})
export class OrderModule { }
