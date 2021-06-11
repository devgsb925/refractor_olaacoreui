export interface IInvoiceReport {
  invoiceNo: string;
  sellDate:Date;
  customerName:string;
  total:number;
  discount:number;
  tax:number;
  shippingCost:number;
  grandTotal:number;
  cash:number;
  bankTransfer:number;
  cost:number;
  profit:number;
  invoiceId : number;
  invoiceStatus: number;
  leasingAmount: number;
}
