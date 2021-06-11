export interface IInvoiceReportFilter {
  invoiceDate:string;
  sellType:string;
  leasingBy:string;
  sellMethod:string;
  operator: number;

  invFromDate: string;
  invToDate: string;

  kw: string;

  show:boolean;
}
