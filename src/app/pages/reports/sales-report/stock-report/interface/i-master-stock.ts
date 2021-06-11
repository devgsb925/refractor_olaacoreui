import { IStockReport } from './i-stock-report';
import { ISummary } from './i-summary';

export interface IMasterStock {
  stockReportListing: IStockReport[];
  stockReportSummary: ISummary;
}
