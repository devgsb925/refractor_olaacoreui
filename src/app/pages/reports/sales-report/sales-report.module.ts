import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { SalesReportRoutingModule } from './sales-report-routing.module';
import { SalesReportComponent } from './sales-report.component';
import { PaginationModule } from 'src/app/shared/components/pagination/pagination.module';

import { FormsModule } from '@angular/forms';
import { FilterSettingModalModule} from './modal/filter-setting-modal/filter-setting-modal.module';
import { VmSalesReportService} from './vm/vm-sales-report.service';
import { SalesReportApiService} from './sales-report-api.service';
import { FilterProductsModalComponent } from './modal/filter-products-modal/filter-products-modal.component';
import { InviceDetailComponent } from './modal/invice-detail/invice-detail.component';
import { PrintInvoiceComponent } from './modal/invice-detail/print-invoice/print-invoice.component'
import { SelectCategoryModule } from '../../store/products/select-category/select-category.module';
import { StockReportComponent } from './stock-report/stock-report.component';
import { StockFillterComponent } from './stock-report/stock-fillter/stock-fillter.component';
@NgModule({
  declarations: [
    SalesReportComponent,
    FilterProductsModalComponent,
    InviceDetailComponent,
    PrintInvoiceComponent,
    StockReportComponent,
    StockFillterComponent,

  ],
  imports: [
    CommonModule,
    SalesReportRoutingModule,
    PaginationModule,
    FormsModule,
    FilterSettingModalModule,
    SelectCategoryModule,
  ],
providers : [VmSalesReportService,SalesReportApiService,DatePipe],

})
export class SalesReportModule {}
