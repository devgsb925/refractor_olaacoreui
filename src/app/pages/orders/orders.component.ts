import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrdersViewModelService } from './view-model/orders-view-model.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {


  constructor(
    public vmOrder: OrdersViewModelService
  ) { }


  ngOnInit(): void {

  }

  ngOnDestroy(): void {

    this.vmOrder.subscription?.unsubscribe();

  }

}
