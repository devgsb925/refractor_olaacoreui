export interface IInvoiceSummaryParams {
  fromDate?: Date;
  toDate?: Date;
  invoiceId: string;
  sellType: number;
  sellMethod: number;
  leaseBank: string;
  operatorIds: number[];
}
