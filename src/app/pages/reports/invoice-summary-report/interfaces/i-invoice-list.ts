export interface IInvoiceList {
  invoiceNo: number;
  sellDate: Date;
  customerName: string;
  total: number;
  tax: number;
  discount: number;
  shippingCost: number;
  grandTotal: number;
  receivedTotal: number;
  change: number;
  cash: number;
  bankTransfer: number;
  leasingName: string;
  charge : number;
}
