import { SortingModule } from './../../shared/pipe/sorting.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExchangeRatesComponent } from './exchange-rates.component';
import { ExchangeRatesRoutingModule } from './exchange-rates-routing.module';
import { PaginationModule } from '../../shared/components/pagination/pagination.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExchangeRatesService } from './api/exchange-rates.service';
import { ExchangeRateViewModel } from './view-model/exchange-rate-view-model';

@NgModule({
  declarations: [ExchangeRatesComponent],
  imports: [
    CommonModule,
    ExchangeRatesRoutingModule,
    PaginationModule,
    ReactiveFormsModule,
    FormsModule,
    SortingModule
  ],

  providers: [ExchangeRatesService, ExchangeRateViewModel],
})
export class ExchangeRatesModule {}
