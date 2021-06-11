import { IInvoiceReport } from "./i-invoice-report";
import { IInvoiceReportSummary } from "./i-invoice-report-summary";

export interface IInvoiceReportSummaryReport {
  invoicesReport:IInvoiceReport[];
  invoicesSummary:IInvoiceReportSummary;
}
