import { IProductReport } from "./i-product-report";
import { IProductReportSummary } from "./i-product-report-summary";

export interface MProductReportSummary {
  productsReport:IProductReport[];
  productsSummary:IProductReportSummary;

}
