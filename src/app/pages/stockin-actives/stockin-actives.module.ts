import { PaginationModule } from './../../shared/components/pagination/pagination.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockinActivesRoutingModule } from './stockin-actives-routing.module';
import { StockinActivesComponent } from './stockin-actives.component';
import { StockinActivesViewModel } from './view-model/stockin-actives-view-model';
import { FormsModule } from '@angular/forms';
import { StockInApiService } from './stock-in-api.service';

@NgModule({
  declarations: [StockinActivesComponent],
  imports: [
    CommonModule,
    StockinActivesRoutingModule,
    FormsModule,
    PaginationModule,
  ],
  providers: [StockinActivesViewModel, StockInApiService],
})
export class StockinActivesModule {}
