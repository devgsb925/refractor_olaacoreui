export interface IInvoiceSummary {
  totalAmount: number;
  taxAmount: number;
  discountAmount: number;
  shippingCost: number;
  grandTotalAmount: number;
  receivedTotalAmount: number;
  changeAmount: number;

  cashAmount:number;
  bankTransferAmount: number;
  caReceivedTotalAmount: number;
  serviceCharge : number;

}
