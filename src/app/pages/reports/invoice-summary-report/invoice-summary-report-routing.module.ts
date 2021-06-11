import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceSummaryReportComponent } from './invoice-summary-report.component';

const routes: Routes = [
  {
    path: '',
    component: InvoiceSummaryReportComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceSummaryReportRoutingModule { }
