import { ExchangeRateSelectorApiService } from './components/exchange-rate-selector-modal/exchange-rate-selector-api.service';
import { ExchangeRateSelectorViewModelService } from './components/exchange-rate-selector-modal/exchange-rate-selector-view-model.service';
import { AddOrderDetailApiService } from './components/add-order-detail/add-order-detail-api.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OrdersComponent } from './orders.component';
import { OrdersRoutingModule } from './orders-routing.module';
import { PaginationModule } from '../../shared/components/pagination/pagination.module';
import { RouterModule } from '@angular/router';


import { OrderViewModelService } from './components/order/order-view-model.service';

// modal
import { EditOrderModule } from './components/edit-order/edit-order.module';

// new api
import { PageOrdersService } from './api/page-orders.service';

import { OrderModule } from './components/order/order.module';
import { PendingOrderModule } from './components/pending-order/pending-order.module';
import { StockModule } from './components/stock/stock.module';
import { OrdersViewModelService } from './view-model/orders-view-model.service';
import { ToastService } from 'src/app/toast/toast-service';
import { EditOrderViewModelService } from './components/edit-order/edit-order-view-model.service';
import { AddOrderDetailComponent } from './components/add-order-detail/add-order-detail.component';
import { AddOrderDetailViewModelService } from './components/add-order-detail/add-order-detail-view-model.service';
import { ExchangeRateSelectorModalComponent } from './components/exchange-rate-selector-modal/exchange-rate-selector-modal.component';

@NgModule({
  declarations: [OrdersComponent, AddOrderDetailComponent, ExchangeRateSelectorModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OrdersRoutingModule,
    PaginationModule,
    RouterModule,
    EditOrderModule,
    PaginationModule,
    //#region new code

    OrderModule,
    PendingOrderModule,
    StockModule

    //#endregion


  ],
  providers: [
    PageOrdersService,
    OrdersViewModelService,
    OrderViewModelService,
    EditOrderViewModelService,
    AddOrderDetailViewModelService,
    AddOrderDetailApiService,
    ExchangeRateSelectorViewModelService,
    ExchangeRateSelectorApiService,
    ToastService
  ]
})
export class OrdersModule { }
