import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'sales-report',
    data: {
      role: 'sales-report',
    },
    loadChildren: () =>
      import('./sales-report/sales-report.module').then(
        (m) => m.SalesReportModule
      )
  },
  {
    path: 'invoice-summary-report',
    data: {
      role: 'invoice-summary-report',
    },
    loadChildren: () =>
      import('./invoice-summary-report/invoice-summary-report.module').then(
        (m) => m.InvoiceSummaryReportModule
      )
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
