import { OrderViewModelService } from './../order/order-view-model.service';
import { OrdersViewModelService } from './../../view-model/orders-view-model.service';
import { ProductReferencesViewModel } from '../../../../view-model/product-references-view-model';
import { Component, OnInit } from '@angular/core';
import { IRefExchangeRate } from 'src/app/api/products/references/interfaces/i-ref-exchange-rate';

@Component({
  selector: 'app-exchange-rate-selector-modal',
  templateUrl: './exchange-rate-selector-modal.component.html',
  styleUrls: ['./exchange-rate-selector-modal.component.scss']
})
export class ExchangeRateSelectorModalComponent implements OnInit {

  constructor(
    public productReferencesViewModel: ProductReferencesViewModel,
    public ordersViewModelService: OrdersViewModelService) { }

  ngOnInit(): void { }

  selectNewCurrency(cur: IRefExchangeRate): void {
    if (window.confirm('Are you sure to change exchange rate?')) {
      this.ordersViewModelService.setExchangeRate(cur);
      this.ordersViewModelService.showExchangeRateModal = false;
    }
  }

}
