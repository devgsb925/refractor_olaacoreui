import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceSummaryReportComponent } from './invoice-summary-report.component';
import { InvoiceSummaryReportRoutingModule } from './invoice-summary-report-routing.module';
import { PaginationModule } from 'src/app/shared/components/pagination/pagination.module';
import { FormsModule } from '@angular/forms';
import { SalesOrderService } from './api/sales-report.service';
import { VmInvoiceSummaryReport } from './vm/vm-invoice-summary-report';
import { NgxLarPrintComponent } from '../ngx-lar-print/ngx-lar-print.component';

@NgModule({
  declarations: [InvoiceSummaryReportComponent, NgxLarPrintComponent],
  imports: [
    CommonModule,
    InvoiceSummaryReportRoutingModule,
    FormsModule,
    PaginationModule,
    FormsModule
  ],
  providers: [SalesOrderService, VmInvoiceSummaryReport],
})
export class InvoiceSummaryReportModule { }
